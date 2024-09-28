import express from 'express';
import { authenticateSession } from '../middleware/session.middleware.js';
import questionController from '../controllers/questions.controller.js';

const router = express.Router();

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Post a new question
 *     description: Create a new question and save it to the database.
 *     tags:
 *       - questions
 *     requestBody:
 *       description: The question to be created.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the question.
 *               body:
 *                 type: string
 *                 description: The body of the question.
 *               optionA:
 *                 type: string
 *                 description: Option A for the question.
 *               optionB:
 *                 type: string
 *                 description: Option B for the question.
 *               optionC:
 *                 type: string
 *                 description: Option C for the question.
 *               optionD:
 *                 type: string
 *                 description: Option D for the question.
 *               correctAnswer:
 *                 type: string
 *                 description: The correct answer for the question.
 *     responses:
 *       201:
 *         description: Question posted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question posted successfully
 *                 data:
 *                   type: object
 *                   description: The created question data.
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     body:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     optionA:
 *                       type: string
 *                     optionB:
 *                       type: string
 *                     optionC:
 *                       type: string
 *                     optionD:
 *                       type: string
 *                     correctAnswer:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Failed to post question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: Error details
 * 
 */

/**
 * @swagger
 * /questions/random:
 *   post:
 *     summary: Get a random question from a specific topic
 *     description: Retrieve a random question associated with the provided topic.
 *     tags:
 *       - questions
 *     parameters:
 *       - in: query
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *           description: The topic for which a random question is to be retrieved.
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Questions retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       body:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       optionA:
 *                         type: string
 *                       optionB:
 *                         type: string
 *                       optionC:
 *                         type: string
 *                       optionD:
 *                         type: string
 *                       correctAnswer:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Topic is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Topic is required
 *       500:
 *         description: Failed to retrieve questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 *                   example: Error details
 * 
 */

router.post("/", authenticateSession, questionController.postQuestion);
router.post("/random", authenticateSession, questionController.getRandomQuestion);

export default router;
