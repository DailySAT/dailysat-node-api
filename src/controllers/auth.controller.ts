import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { cluster } from '../libs/redis.js';
import { db } from '../utils/db.js';
import { user } from '../schema.js';
import { and, eq } from 'drizzle-orm';
import { generateCode } from '../libs/generateCode.js';
import handleError from '../libs/handleError.js';

const saltRounds = 10;

const authController = {
    registerEmail: async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        try {
            // Check if a user with the given email already exists
            const existingUser = await db
                .select()
                .from(user)
                .where(eq(user.email, email))
                .limit(1)
                .execute(); // Execute the query

            if (existingUser.length > 0) {
                return res.status(400).json({
                    message: "Email already in use",
                    error: "email-in-use"
                });
            }

            // Hash the password (for security reasons)
            const hash = await bcrypt.hash(password, saltRounds);

            // Create a new user
            await db
                .insert(user)
                .values({
                    name,
                    email,
                    password: hash,
                    isVerified: false
                })
                .execute(); // Execute the insertion
            
            // Generate a code
            await generateCode(email, 'verify');

            // Send response
            res.status(201).json({
                message: 'User registered successfully',
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    loginEmail: async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            // Find user by email
            const foundUser = await db
                .select()
                .from(user)
                .where(eq(user.email, email))
                .limit(1)
                .execute(); // Execute the query

            const userObject = foundUser[0];

            // Make sure user is not null (meaning there is no record of it in the db)
            if (!userObject) {
                return res.status(401).json({
                    message: "There is no such user in our db system",
                    error: "no-err-user"
                });
            }

            if (!userObject.isVerified) {
                return res.status(401).json({
                    message: 'User is not verified yet. Verify your email and check your email.',
                    error: 'invalid-verification'
                });
            }

            // Compare the plain password with the hashed password in the database
            const match = await bcrypt.compare(password, userObject.password || "");

            if (match) {
                // Set user session if match is true
                req.session.user = { email: userObject.email || "" };
                return res.status(200).json({
                    message: 'Login successful',
                });
            } else {
                return res.status(401).json({
                    message: 'Invalid email or password',
                    error: 'invalid-credentials'
                });
            }
        } catch (error) {
            handleError(res, error);
        }
    },

    logOut: (req: Request, res: Response) => {
        if (!req.session) {
            return res.status(500).json({
                message: "User is not logged in and therefore cannot be logged out",
                error: "no-session-id"
            });
        }

        req.session.destroy((err) => {
            if (!err) {
                res.status(200).json({
                    message: "Logged user out and killed session from express-session and redis"
                });
            } else {
                console.error(err);
                res.status(500).json({
                    message: "Error occurred while logging out",
                    error: err.message,
                });
            }
        });
    },

    deleteUser: async (req: Request, res: Response) => {
        const { email } = req.body;

        try {
            if (req.session && req.session.user && req.session.user.email === email) {
                await db
                    .delete(user)
                    .where(eq(user.email, email))
                    .execute(); // Execute the deletion

                res.status(200).json({
                    message: "User deleted successfully"
                });
            } else {
                return res.status(401).json({
                    message: "You do not have access to update this user",
                    error: "no-auth-access"
                });
            }
        } catch (error) {
            handleError(res, error);
        }
    },

    generateCode: async (req: Request, res: Response) => {
        const { email, type } = req.body;

        try {
            await generateCode(email, type);

            if (type !== "verify" && type !== "reset") {
                return res.status(500).json({
                    message: "The type is invalid. It must be either 'verify' or 'reset'.",
                    error: "no-valid-type"
                });
            }

            // Only need the user db object when generating a verification code, otherwise it is a wasted db call (efficiency)
            if (type === "verify") {
                const userFromDB = await db
                    .select()
                    .from(user)
                    .where(eq(user.email, email))
                    .limit(1)
                    .execute(); // Execute the query

                if (userFromDB.length === 0) {
                    return res.status(400).json({
                        message: "There is no such user. Invalid email provided",
                        error: "no-user-exist"
                    });
                }
            }
            
            return res.json({
                message: "Token is sent to the user"   
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    verifyEmail: async (req: Request, res: Response) => {
        const { email, code } = req.body;

        try {
            cluster.get(`verify:${email}`, async (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error retrieving verification code from cache',
                        error: err.message,
                    });
                }

                if (result === code) {
                    // Removing token from cache so it cannot be used again
                    await cluster.del(`verify:${email}`);

                    await db
                        .update(user)
                        .set({ isVerified: true })
                        .where(
                            and(
                                eq(user.email, email),
                                eq(user.isVerified, false)
                            )
                        )
                        .execute(); // Execute the update

                    return res.status(200).json({
                        message: "User's email has been verified! They may log in now."
                    });
                } else {
                    return res.status(401).json({
                        message: "Code is not valid, please input better code",
                        error: "invalid-code-error"
                    });
                }
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    resetPassword: async (req: Request, res: Response) => {
        const { code, email, newPassword } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            cluster.get(`reset:${email}`, async (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error retrieving reset code from cache',
                        error: err.message,
                    });
                }

                if (result === code) {
                    // Removing token from cache so it cannot be used again
                    await cluster.del(`reset:${email}`);

                    await db
                        .update(user)
                        .set({ password: hashedPassword })
                        .where(eq(user.email, email))
                        .execute(); // Execute the update

                    return res.status(200).json({
                        message: "User has changed their password successfully"
                    });
                } else {
                    return res.status(401).json({
                        message: "Code is not valid, please input better code",
                        error: "invalid-code-error"
                    });
                }
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    checkSession: async (req: Request, res: Response) => {
        try {
            // Checking if a session which contains user data exists
            if (!req.session.user) {
                return res.status(200).json({ success: false });
            } else {
                return res.status(200).json({ success: true });
            }
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default authController;
