import express from 'express'
import authenticateSession from '../middleware/session.middleware.js'
import questionController from '../controllers/questions.controller.js'
const router = express.Router()

router.post("/", authenticateSession, questionController.postQuestion)
router.post("/user", authenticateSession, questionController.getUserQuestion)

export default router