import { Request, Response } from 'express';
import { db } from '../utils/db.js';
import { post } from '../schema.js';
import { eq, sql } from 'drizzle-orm';

const indexController = {
    getReadingQuestions: async (req: Request, res: Response) => {
        const { type } = req.query

        // Getting question based on the speific type of reading problem requested

        // Making sure the type is valid, or else giving a bad response
        
        if (type !== "comprehension" && type !== "analysis" && type !== "synthesis" && type !== "evaluation") {
            return res.status(400).json({ message: "Invalid type specified." });
        }        
        
        const randomQuestion = await db
        .select()
        .from(post)
        .where(eq(post.topicID, type as string))
        .orderBy(sql`RANDOM()`)
        .limit(1)
        .execute(); // Execute the query
        
        res.json({
            randomQuestion,
            message: "Your random question for " + type 
        })
    }
};

export default indexController