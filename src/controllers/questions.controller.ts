import { Request, Response } from 'express';
import { db } from '../utils/db.js';
import { post, postTopic } from '../schema.js';
import { eq, sql } from 'drizzle-orm';
import handleError from '../libs/handleError.js'

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
            handleError(res,error)
        }
    },
    getRandomQuestion: async (req: Request, res: Response) => {
        const topic = req.query.topic as string;
    
        // Validate the email
        if (!topic) {
            return res.status(400).json({
                message: 'Email is required',
            });
        }
    
        try {
            // Get the type of questions + topics
            const topicResult = await db
                .select({
                    id: postTopic.id
                })
                .from(postTopic)
                .where(eq(postTopic.name, topic));

            // Now use this to query the proper questions we want (from the same topic and whatnot)
            // Ordered it randomly and limited to one result to get one random question at a time

            const randomQuestion = await db 
                .select()
                .from(post)
                .where(eq(post.topicID, topicResult[0].id))
                .orderBy(sql`RAND()`)
                .limit(1);
        
    
            res.status(200).json({
                message: 'Questions retrieved successfully',
                data: randomQuestion,
            });

        } catch (error: any) {
            handleError(res,error)
        }
    }
    
};

export default questionController;
