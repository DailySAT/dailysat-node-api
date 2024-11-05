import { Request, Response } from 'express';
import { db } from '../utils/db.js';
import { editorial, post } from '../schema.js';
import { eq, sql } from 'drizzle-orm';
import handleError from '../libs/handleError.js';

const indexController = {
    getReadingQuestions: async (req: Request, res: Response) => {
        try {
            const { type } = req.query;

            // Validate the type query parameter
            if (
                type !== "convention" &&
                type !== "craft" &&
                type !== "ideas" &&
                type !== "information"
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
    },
    getEditorialReading: async (req: Request, res: Response) => {
        try {
            const {questionID} = req.query

            // Ensure questionID is a valid number as the editorial foreign key is a numerical value!

            const questionIdNumber = parseInt(questionID as string, 10);
            if (isNaN(questionIdNumber)) {
                throw new Error('Invalid questionID: must be a number');
            }

            const editorials = await db
                .select()
                .from(editorial)
                .where(eq(editorial.questionId, questionIdNumber))
                .execute();

            res.json({
                message: "Sucessfully sent editorials",
                editorials
            })

        } catch(err) {
            handleError(res, err)
        }
    }
};

export default indexController;
