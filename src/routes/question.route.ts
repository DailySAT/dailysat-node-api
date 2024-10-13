import express from 'express'
import questionController from '../controllers/question.controller.js'
const router = express.Router()

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get a random question from JSON file of questions
 *     responses:
 *       200:
 *         description: A JSON object with different information about DailySAT backend
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: DailySAT API
 *                 author:
 *                   type: string
 *                   example: DailySAT Engineering Team
 *                 date_created:
 *                   type: string
 *                   example: July 28 2024
 *                 message:
 *                   type: string
 *                   example: Let's change the world 🚀
 */

 

router.get("/get/reading", questionController.getReadingQuestions)

export default router