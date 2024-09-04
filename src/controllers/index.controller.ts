import { Request, Response } from 'express';

const indexController = {
    get: (req: Request, res: Response) => {
        res.json({
            "name": "CycleVend API",
            "author": "CycleVend Engineering Team",
            "date_created": "July 28 2024",
            "message": "Let's change the world 🚀"
        });
    }
};

export default indexController