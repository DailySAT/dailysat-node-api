import express from 'express'
import indexController from '../controllers/index.controller.js'
import { authenticateSession } from '../middleware/session.middleware.js'
const router = express.Router()


router.get("/", authenticateSession, indexController.get)

export default router