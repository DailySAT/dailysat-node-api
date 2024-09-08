import { Request, Response } from 'express';

const indexController = {
    get: (req: Request, res: Response) => {
        res.json({
            "name": "Dailysat API",
            "author": "Hemit Patel + Aarush Kute",
            "date_created": "September 3 2024",
            "message": "Let's change the world 🚀"
        });
    }
};

export default indexController