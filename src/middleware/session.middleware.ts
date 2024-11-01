import {NextFunction, Request, Response} from 'express'

export const authenticateSession = (req: Request, res: Response, next: NextFunction) => {
    
    // using express sessions for session management (instead of pure passportjs)
    // only using passportjs for the authentication middleware
    
    if (req.session.user) {
        next()
    } else {
        return res.status(401).json({
            message: 'You are currently not authenticated! Please log in and try again.',
            error: 'no-auth',
        });
    }
}
