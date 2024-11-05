import { Request, Response } from 'express';
import { db } from '../utils/db.js';
import { user } from '../schema.js';
import { eq } from 'drizzle-orm';
import handleError from '../libs/handleError.js';
import dotenv from 'dotenv'
import axios from 'axios';

dotenv.config()

const authController = {
    login: async (req: Request, res: Response) => {
        const { access_token } = req.query;
    
        if (req.session.user) {
            return res.status(200).json({
                message: "You are already logged in, so no need to log in again!",
                error: "already-authenticated"
            });
        }
    
        try {
            // getting the response from googleapis based on the token given
            // using axios to make the api request calls
            const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo`, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
    
            const userEmail = response.data.email;
            const userObj = await db
                .select()
                .from(user)
                .where(eq(user.email, userEmail))
                .execute();
    
            // If user does not exist, add them to the database
            if (!userObj[0]) {
                await db
                    .insert(user)
                    .values({
                        email: userEmail,
                        name: response.data.name,
                        googleid: response.data.id
                    });
            }
    
            // Build a new session as the user has been verified by Google
            req.session.user = { email: userEmail };
    
            return res.json({
                message: "Successfully logged into DailySAT Platforms",
                user: {
                    email: userEmail,
                    name: response.data.name,
                    googleid: response.data.id
                }
            });
        } catch (error: any) {

            if (error.status == 401) {
                return res.status(500).json({
                    message: "Invalid Google token (not authenticated 401)",
                    error: "invalid-token"
                })
            } else {
                handleError(res, error);
            }
        }
    },
    
    logOut: (req: Request, res: Response) => {
        try {
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
       
        } catch(error:any) {
            handleError(res, error);
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        // using the email from the session so that user can only delete account they are signed into
        const { email } = req.session.user ?? {}

        try {
                await db
                    .delete(user)
                    .where(eq(user.email, email as string))
                    .execute(); // Execute the deletion

                res.status(200).json({
                    message: "User deleted successfully"
                });
            
        } catch (error) {
            handleError(res, error);
        }
    },

    checkSession: async (req: Request, res: Response) => {
        try {
            // Checking if a session which contains user data exists
            if (req.session) {
                return res.status(200).json({
                    success: true,
                    session: req.user
                });           
            } else {
                return res.status(400).json({
                    success: false,
                    session: "none"
                })
            }
        } catch (error) {
            handleError(res, error);
        }
    },
    error: async (req: Request, res: Response) => {

        const { error } = req.query;

        res.json({
            message: "An error has occured! Please contact DailySAT executive team to get this sorted right away!",
            error: error
        })
    }
}

export default authController;
