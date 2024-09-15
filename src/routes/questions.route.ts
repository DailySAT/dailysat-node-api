import express from 'express';
import { authenticateSession } from '../middleware/session.middleware.js';
import questionController from '../controllers/questions.controller.js';

const router = express.Router();

/**
 * @swagger
 * /search:
 *   post:
 *     summary: Post a new question
 *     description: Create a new question and save it to the database.
 *     tags:
 *       - [questions]
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
 *                 data:
 *                   type: object
 *                   description: The created question data.
 *       500:
 *         description: Failed to post question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 * 
 */

/**
 * @swagger
 * /search/user:
 *   post:
 *     summary: Get questions for a specific user
 *     description: Retrieve all questions associated with the provided email.
 *     tags:
 *       - [questions]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           description: The email of the user whose questions are to be retrieved.
 *     responses:
 *       200:
 *         description: Questions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       body:
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
 *       400:
 *         description: Email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to retrieve questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 * 
 */

router.post("/", authenticateSession, questionController.postQuestion);
router.post("/user", authenticateSession, questionController.getUserQuestion);

export default router;
