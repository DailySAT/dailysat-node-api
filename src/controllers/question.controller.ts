import { Request, Response } from 'express';
import { db } from '../utils/db.js';
import { post } from '../schema.js';
import { eq, sql } from 'drizzle-orm';
import handleError from '../libs/handleError.js';

const indexController = {
    getReadingQuestions: async (req: Request, res: Response) => {
        try {
            const { type } = req.query;

            // Validate the type query parameter
            if (
                type !== "comprehension" &&
                type !== "analysis" &&
                type !== "synthesis" &&
                type !== "evaluation"
            ) {
                return res.status(400).json({ message: "Invalid type specified." });
            }

            // Fetch a random question based on the provided type
            const randomQuestion = await db
                .select()
                .from(post)
                .where(eq(post.topicID, type as string))
                .orderBy(sql`RANDOM()`)
                .limit(1)
                .execute();

            // Return the random question
            return res.json({
                randomQuestion,
                message: "Your random question for " + type
            });
        } catch (error) {
            handleError(res, error);
        }
    }
};

export default indexController;
