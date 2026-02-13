

const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/api/auth.controller');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The name of user
 *         email:
 *           type: string
 *           description: The email of user
 *         password:
 *           type: string
 *           description: The password of user
 *         role:
 *           type: string
 *           description: The role of user 'admin' or 'user'
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of user
 *         password:
 *           type: string
 *           description: The password of user
 *     
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Auth managing API
 * /register:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
*     responses:
 *       '200':
 *         description: User Created
 *         content:
 *           application/json:
 *             example:
 *               userCreated:
 *                 id: "103ecbc8-ad46-4668-9f51-12bcef159bb3"
 *                 name: "dummy"
 *                 email: "dummy@gmail.com"
 *                 password: "$2a$08$0jMq80ot9Y6e5r.2udXVY.Sj46TvVoJI/wyiGfpqr8s378uCVymL."
 *                 role: "admin"
 *                 createdAt: "2024-02-03T13:55:35.124Z"
 *                 updatedAt: "2024-02-03T13:55:35.124Z"
 *                 isEmailVerified: false
 *               tokens:
 *                 access:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDNlY2JjOC1hZDQ2LTQ2NjgtOWY1MS0xMmJjZWYxNTliYjMiLCJpYXQiOjE3MDY5Njg1MzYsImV4CI6MTcwNjk3MDMzNiwidHlwZSI6ImFjY2VzcyJ9.xMktH0n7aPXtRA0Xzw4OwgmGk8hpXzKYBy-1i1ht6_M"
 *                   expires: "2024-02-03T14:25:36.243Z"
 *                 refresh:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDNlY2JjOC1hZDQ2LTQ2NjgtOWY1MS0xMmJjZWYxNTliYjMiLCJpYXQiOjE3MDY5Njg1MzYsImV4CI6MTcwOTU2MDUzNiwidHlwZSI6InJlZnJlc2gifQ.8W1zMo_dziHVD8ge-T00Bcxbw42nWzj_6tOpV-lKcrM"
 *                   expires: "2024-03-04T13:55:36.246Z"
 *       '400':
 *         description: Email already taken
 *         content:
 *           application/json:
 *             example:
 *               code: 400
 *               message: "Email already taken"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               code: 500
 *               message: "Internal server error"
 * /login:
 *   post:
 *     summary: Login from existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       '200':
 *         description: User Login
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 id: "103ecbc8-ad46-4668-9f51-12bcef159bb3"
 *                 name: "dummy"
 *                 email: "dummy@gmail.com"
 *                 password: "$2a$08$0jMq80ot9Y6e5r.2udXVY.Sj46TvVoJI/wyiGfpqr8s378uCVymL."
 *                 role: "admin"
 *                 createdAt: "2024-02-03T13:55:35.124Z"
 *                 updatedAt: "2024-02-03T13:55:35.124Z"
 *                 isEmailVerified: false
 *               tokens:
 *                 access:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDNlY2JjOC1hZDQ2LTQ2NjgtOWY1MS0xMmJjZWYxNTliYjMiLCJpYXQiOjE3MDY5Njg1NjIsImV4cCI6MTcwNjk3MDM2MiwidHlwZSI6ImFjY2VzcyJ9.5IChaTIjTjTkgRsJ-Ofk_KnXaZJUwKn0Y6rdA3F9vQ4"
 *                   expires: "2024-02-03T14:26:02.049Z"
 *                 refresh:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDNlY2JjOC1hZDQ2LTQ2NjgtOWY1MS0xMmJjZWYxNTliYjMiLCJpYXQiOjE3MDY5Njg1NjIsImV4cCI6MTcwOTU2MDU2MiwidHlwZSI6InJlZnJlc2gifQ.KNR3tijv7lzkxNTnAbGiR-GatgD9ynsInhFAGwr7V8E"
 *                   expires: "2024-03-04T13:56:02.049Z"
 *             schema:
 *                $ref: '#/components/schemas/Login'
 *       '400':
 *         description: Email or Password required
 *         content:
 *           application/json:
 *             example:
 *               code: 400
 *               message: "\"email\" is required, \"password\" is required"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               code: 500
 *               message: "Internal server error"
 */