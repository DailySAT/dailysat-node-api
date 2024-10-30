import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', authController.registerEmail);
router.post('/login', authController.loginEmail);
router.post('/logout', authController.logOut);
router.post('/generate-code', authController.generateCode)
router.post('/reset-password', authController.resetPassword)
router.post('/verify', authController.verifyEmail)
router.get('/check-session', authController.checkSession)

export default router;