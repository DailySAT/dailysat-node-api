import express from 'express';
import { authenticateSession } from '../middleware/session.middleware.js';
import topicController from '../controllers/topic.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Topics
 *   description: API for managing topics
 */

/**
 * @swagger
 * /api/topics:
 *   post:
 *     summary: Create a new topic
 *     tags: topics
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the topic
 *     responses:
 *       201:
 *         description: Topic posted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Topic posted successfully
 *                 data:
 *                   type: object
 *                   description: The created topic record
 *       400:
 *         description: Bad request if the name is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal Server Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal Server Error'
 *                 error:
 *                   type: string
 *                   example: 'Error message here'
 */
router.post("/", authenticateSession, topicController.postTopic);

/**
 * @swagger
 * /api/topics/update:
 *   post:
 *     summary: Update an existing topic
 *     tags: topics
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: The ID of the topic to update
 *               name:
 *                 type: string
 *                 description: The new name for the topic
 *     responses:
 *       200:
 *         description: Topic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Topic updated successfully
 *       400:
 *         description: Bad request if the ID or name is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal Server Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal Server Error'
 *                 error:
 *                   type: string
 *                   example: 'Error message here'
 */

router.post("/update", authenticateSession, topicController.updateTopic);

/**
 * @swagger
 * /api/topics/delete:
 *   post:
 *     summary: Delete a topic
 *     tags: topics
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: The ID of the topic to delete
 *     responses:
 *       200:
 *         description: Topic deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Topic deleted successfully
 *       400:
 *         description: Bad request if the ID is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal Server Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal Server Error'
 *                 error:
 *                   type: string
 *                   example: 'Error message here'
 */

router.post("/delete", authenticateSession, topicController.deleteTopic);

export default router;
