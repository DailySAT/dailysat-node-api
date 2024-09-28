import { Request, Response } from 'express';
import { db } from '../utils/db.js';
import { postTopic } from '../schema.js';
import { eq } from 'drizzle-orm';
import handleError from '../libs/handleError.js'

const questionController = {
    postTopic: async (req: Request, res: Response) => {
        const { name } = req.body;

        try {
            // Insert new topic into the database (admin level action)

            const result = await db
                .insert(postTopic)
                .values({
                    name
                })
                .returning();  // Optional, if you want to return the created record

            res.status(201).json({
                message: 'Topic posted successfully',
                data: result,
            });
        } catch (error: any) {
            handleError(res,error)
        }
    },
    deleteTopic: async (req: Request, res: Response) => {
        const { id } = req.body;

        try {
            // Deleting the topic from the db

             await db
                .delete(postTopic)
                .where(eq(postTopic.id, id)); // Replace `someId` with the actual ID of the record you want to delete
        
            res.status(201).json({
                message: 'Topic deleted successfully',
            });
        } catch (error: any) {
            handleError(res,error)
        }
    },

    updateTopic: async (req: Request, res: Response) => {
        const { id, name } = req.body;
    
        try {
            // Updating the topic in the database
            await db
                .update(postTopic)
                .set({
                    name: name,        // Set the new name for the topic
                })
                .where(eq(postTopic.id, id)); // Specify the ID of the topic to update
    
            res.status(200).json({
                message: 'Topic updated successfully',
            });
        } catch (error: any) {
            handleError(res, error);
        }
    }
    
};

export default questionController;
