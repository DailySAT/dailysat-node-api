import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();


/**
 * @swagger
 *  /auth/register:
 *    post:
 *      summary: Register a new user to CycleVend's PostgreSQL database
 *      tags: [authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  example: user@cyclevend.com
 *                name:
 *                  type: string
 *                  example: newuser
 *                password:
 *                  type: string
 *                  example: supersecretpassword123
 *      responses:
 *        201:
 *          description: User registered successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: User registered successfully
 *                  userObj:
 *                    type: object
 *                    properties:
 *                      email:
 *                        type: string
 *                        format: email
 *                        example: user@cyclevend.com
 *                      name:
 *                        type: string
 *                        example: newuser
 *                      password:
 *                        type: string
 *                        example: hashedpassword123
 */


/**
 * @swagger
 *  /auth/login:
 *    post:
 *      summary: Log in a user using email
 *      tags: [authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  example: user@cyclevend.com
 *                password:
 *                  type: string
 *                  example: supersecretpassword123
 *      responses:
 *        200:
 *          description: Login successful
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Login successful
 *        401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Invalid email or password
 */


/**
 * @swagger
 *  /auth/logout:
 *    post:
 *      summary: Log out the current user
 *      tags: [authentication]
 *      responses:
 *        200:
 *          description: User logged out successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Logged user out and killed session from express-session and redis
 *        500:
 *          description: User is not logged in
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: User is not logged in and therefore cannot be logged out
 *                  error:
 *                    type: string
 *                    example: no-session-id
 */


/**
 * @swagger
 *  /auth/generate-code:
 *    post:
 *      summary: Generate a verification code for the user
 *      tags: [authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  example: user@cyclevend.com
 *      responses:
 *        200:
 *          description: Token is sent to the user
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Token is sent to the user
 *        400:
 *          description: Invalid email provided
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: There is no such user. Invalid email provided
 *                  error:
 *                    type: string
 *                    example: no-user-exist
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Internal Server Error
 *                  error:
 *                    type: string
 *                    example: error message here
 */

/**
 * @swagger
 *  /auth/reset-password:
 *    post:
 *      summary: Allows you to reset password based on code given
 *      tags: [authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                  example: 1234
 *                email:
 *                  type: string
 *                  example: user@cyclevend.com
 *                newPassword:
 *                  type: string
 *                  example: coolnewpassword123
 *      responses:
 *        200:
 *          description: User's password was sucessfully reset
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: User has changed their password sucessfully
 *        401:
 *          description: The code given was not valid due to it not existing, expiring or not belonging to the proper email user id
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Code is not valid, please input better code
 *                  error:
 *                    type: string
 *                    example: invalid-code-error
 */

/**
 * @swagger
 *  /auth/oauth/google:
 *    get:
 *      summary: Google SSO authentication
 *      tags: [authentication]
 *      responses:
 *        200:
 *          description: User authenticated successfully
 *        500:
 *          description: Invalid Google token
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Invalid google token, use another one please!
 *                  error:
 *                    type: string
 *                    example: invalid-token
 */


/**
 * @swagger
 *  /auth/check-session:
 *    get:
 *      summary: Checking session for client-side
 *      tags: [authentication]
 *      responses:
 *        200:
 *          description: User authenticated successfully
 *        500:
 *          description: An error occured
 *        401: 
 *          description: User is NOT authenticated and show different UI screen (giving a success false attribute)
 */



router.post('/register', authController.registerEmail);
router.post('/login', authController.loginEmail);
router.post('/logout', authController.logOut);
router.post('/generate-code', authController.generateCode)
router.post('/reset-password', authController.resetPassword)
router.post('/verify', authController.verifyEmail)
router.get('/oauth/google', authController.googleSSO)
router.get('/check-session', authController.checkSession)

export default router;