import { Request, Response } from 'express';
import { db } from '../utils/db.js';
import { user } from '../schema.js';
import { eq } from 'drizzle-orm';
import handleError from '../libs/handleError.js';

const authController = {
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


    checkSession: async (req: Request, res: Response) => {
        try {
            // Checking if a session which contains user data exists
            if (!req.session.user) {
                return res.status(200).json({ success: false });
            } else {
                return res.status(200).json({ 
                    success: true,
                    session: req.session.user
                });
            }
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default authController;
