import { Request, Response } from 'express';
import { db } from '../utils/db.js';
import { user } from '../schema.js';
import { eq } from 'drizzle-orm';
import handleError from '../libs/handleError.js';
import passport from 'passport';

const authController = {
    login: (req: Request, res: Response) => {

        if (!req.session.user) {
            passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
        } else {
            return res.json({
                message: "You are already logged in, so no need to log in again!",
                error: "already-authenticated"
            })
        }
    },

    callBack: async (req: Request, res: Response) => {
        passport.authenticate('google', { failureRedirect: '/auth/error' }, async (err: any, profile: any) => {
            if (err || !profile) {
                return res.json({err})
            } else {
                req.session.user = { email: profile.email };
                return res.redirect('/auth/success')
            }
        })(req, res);
        
    },

    logOut: (req: Request, res: Response) => {
        if (req.session) {
            req.session.destroy((err) => {
                if (!err) {
                    res.redirect('/auth/success')
                } else {
                    res.redirect('/auth/error?error="Authentication Error from Express Session')
                }
              })        
            } else {
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
            if (!req.session) {
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
    },
    success: async (req: Request, res: Response) => {
        res.json({
            message: "You have been sucessfully logged into our ecosystem",
            success: true
        })
    },
    error: async (req: Request, res: Response) => {

        const { error } = req.query;

        res.json({
            message: "An error has occured! Please contact DailySAT executive team to get this sorted right away!",
            success: true,
            error: error
        })
    }
}

export default authController;
