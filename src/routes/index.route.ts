import express from 'express'
import indexController from '../controllers/index.controller.js'
import { authenticateSession } from '../middleware/session.middleware.js'
const router = express.Router()

/**
 * @swagger
 * /:
 *   get:
 *     summary: The default endpoint for when API is first accessed
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

 

router.get("/", authenticateSession, indexController.get)

export default router