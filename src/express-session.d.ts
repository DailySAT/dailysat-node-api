import 'express-session';

declare module 'express-session' {
    interface SessionData {
        expiry: any,
        user?: {email: string, admin: boolean};
    }
}
