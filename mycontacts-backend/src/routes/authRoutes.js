const express = require('express');
const { register, login, profile } = require('../controllers/authController');
const {authJwt} = require('../middlewares/authMiddleware');
const { runValidation, registerValidator, loginValidator } = require('../middlewares/validateMiddleware')

const router = express.Router();

router.post('/register', registerValidator, runValidation, register);
router.post('/login', loginValidator, runValidation, login);
router.get('/profile', authJwt, profile);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Please provide email and password
 *       409:
 *         description: Email already used
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: login successful
 *       401:
 *         description: Invalid email or password
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */