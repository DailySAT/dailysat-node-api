import express from 'express'
import questionController from '../controllers/question.controller.js'
const router = express.Router()


router.get("/get/reading", questionController.getReadingQuestions)
router.get("/editorial/reading", questionController.getEditorialReading)

export default router