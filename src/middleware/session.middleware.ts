import {NextFunction, Request, Response} from 'express'

export const authenticateSession = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        next()
    } else {
        return res.status(401).json({
            message: 'You are currently not authenticated! Please log in and try to access this resource again.',
            error: 'no-auth',
        });
    }
}

export const authenticateAdminSession = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user?.admin) {
        next()
    } else {
        return res.status(401).json({
            message: 'You are not an admin user',
            error: 'no-admin-auth',
        });
    }
}