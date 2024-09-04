import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { cluster } from '../libs/redis.js';
import { html, transporter } from '../libs/nodeMailerConfig.js';
import axios from 'axios';
import { db } from '../utils/db.js';
import { user } from '../schema.js';
import { and, eq } from 'drizzle-orm';

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

            // Send response
            res.status(201).json({
                message: 'User registered successfully',
            });
        } catch (error: unknown) {
            // Check if error is an instance of Error
            if (error instanceof Error) {
                res.status(500).json({
                    message: 'Internal Server Error',
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    message: 'Internal Server Error',
                });
            }
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
                return res.status(403).json({
                    message: "User email is not verified. Please try again once verified",
                    error: "no-verification"
                });
            }

            if (!userObject.isVerified) {
                return res.status(401).json({
                    message: 'Invalid email or password. This could be because the user does not exist or is not verified yet',
                    error: 'invalid-account-error'
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
        } catch (error: unknown) {
            // Check if error is an instance of Error
            if (error instanceof Error) {
                return res.status(500).json({
                    message: 'Internal Server Error',
                    error: error.message,
                });
            } else {
                return res.status(500).json({
                    message: 'Internal Server Error',
                });
            }
        }
    },

    googleSSO: async (req: Request, res: Response) => {
        const { token: socialToken } = req.body;

        try {
            let response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${socialToken}`);
            if (response.data.error || !response.data.email) {
                return res.status(500).json({
                    message: 'Invalid Google token, use another one please!',
                    error: 'invalid-token'
                });
            }

            const userFromDB = await db
                .select()
                .from(user)
                .where(eq(user.email, response.data.email))
                .limit(1)
                .execute(); // Execute the query

            const userDBObj = userFromDB[0];

            if (userDBObj) {
                // User exists, so just assign session
                req.session.user = { email: response.data.email };
            } else {
                // User does not exist, so create a new one in the db and then assign session
                const newUser = await db
                    .insert(user)
                    .values({
                        name: response.data.name,
                        email: response.data.email, // Fixed typo here
                        isVerified: false
                    })
                    .returning({
                        email: user.email
                    })
                    .execute(); // Execute the insertion

                const newUserObj = newUser[0];
                req.session.user = { email: newUserObj.email || "" };
            }

            res.status(200).json({
                message: 'User successfully authenticated via Google SSO'
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({
                    message: 'Internal Server Error',
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    message: 'Internal Server Error',
                });
            }
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
    },

    generateCode: async (req: Request, res: Response) => {
        const { email, type } = req.body;

        try {
            const foundUser = await db
                .select()
                .from(user)
                .where(eq(user.email, email))
                .limit(1)
                .execute(); // Execute the query

            const userObject = foundUser[0];

            if (!userObject) {
                return res.status(500).json({
                    message: "There is no such user. Invalid email provided",
                    error: "no-user-exist"
                });
            }

            if (type !== 'verify' && type !== 'reset') {
                return res.status(400).json({
                    message: "Type is incorrect. It can only be verify or reset. Please change your request",
                    error: "wrong-value-type"
                });
            }

            if (type === 'verify' && userObject.isVerified) {
                return res.status(500).json({
                    message: "You are already verified. No need for another verification code",
                    error: "already-verified-spam"
                });
            }

            // Generate a random integer between 1000 and 9999
            const token = crypto.randomInt(1000, 10000);
            const tokenString = token.toString();
            const tokenList = Array.from(tokenString); // Convert string to array of characters

            // Put token into Redis with email as key, and set expiration to 5 minutes
            await cluster.setex(`${type}:${email}`, 300, token.toString());
            const htmlCode = await html(userObject.name, tokenList, type);

            // Send email
            await transporter.sendMail({
                from: "hemitvpatel@gmail.com",
                to: email,
                subject: `Your ${type} code`,
                html: htmlCode
            });

            res.status(200).json({
                message: "Token is sent to the user"
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({
                    message: 'Internal Server Error',
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    message: 'Internal Server Error',
                });
            }
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({
                    message: 'Internal Server Error',
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    message: 'Internal Server Error',
                });
            }
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({
                    message: 'Internal Server Error',
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    message: 'Internal Server Error',
                });
            }
        }
    }
};

export default authController;
    