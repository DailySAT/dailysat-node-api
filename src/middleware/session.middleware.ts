import {NextFunction, Request, Response} from 'express'

export const authenticateSession = (req: Request, res: Response, next: NextFunction) => {
    
    // passport.js creates a new object of user with all user info when logged in
    // therefore if there is not user object the user must be logged out of the system 
    
    if (req.user) {
        next()
    } else {
        return res.status(401).json({
            message: 'You are currently not authenticated! Please log in and try again.',
            error: 'no-auth',
        });
    }
}
