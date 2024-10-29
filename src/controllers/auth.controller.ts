import { Request, Response } from 'express';
import { db } from '../utils/db.js';
import { user } from '../schema.js';
import { eq } from 'drizzle-orm';
import handleError from '../libs/handleError.js';
import passport from 'passport';

const authController = {
    login: async (req: Request, res: Response) => {
        passport.authenticate('google', {scope: 'profile'})
    },
    callBack: async (req: Request, res: Response) => {
        passport.authenticate('google', {failureMessage: "A failure has occured. Please email the DailySAT team"})
    },
    logOut: (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(400).json({
                message: "User is not logged in and therefore cannot be logged out",
                error: "not-authenticated"
            });
        }
    
        req.logout((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Error occurred while logging out",
                    error: err.message,
                });
            }
    
            res.status(200).json({
                message: "Successfully logged out"
            });
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
            if (!req.user) {
                return res.status(200).json({ success: false });
            } else {
                return res.status(200).json({ 
                    success: true,
                    session: req.user
                });
            }
        } catch (error) {
            handleError(res, error);
        }
    }
}

export default authController;


