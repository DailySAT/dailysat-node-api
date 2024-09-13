import { Request, Response } from 'express';
import { db } from '../utils/db.js';
import { post } from '../schema.js';

const questionController = {
    postQuestion: async (req: Request, res: Response) => {
        const { title, body, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

        let email = req.session.user?.email;

        if (typeof email === "undefined") {
            email = "No owner"
        }

        try {
            // Insert new question into the database
            const result = await db
                .insert(post)
                .values({
                    title,
                    body,
                    userId: email,
                    optionA,
                    optionB,
                    optionC,
                    optionD,
                    correctAnswer,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();  // Optional, if you want to return the created record

            res.status(201).json({
                message: 'Question posted successfully',
                data: result,
            });
        } catch (error: any) {
            console.error('Error posting question:', error);
            res.status(500).json({
                message: 'Failed to post question',
                error: error.message,
            });
        }
    }
};

export default questionController;
