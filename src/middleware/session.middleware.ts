import {NextFunction, Request, Response} from 'express'

const authenticateSession = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        next()
    } else {
        return res.status(401).json({
            message: 'You are currently not authenticated! Please log in and try to access this resource again.',
            error: 'no-auth',
        });
    }
}

export default authenticateSession