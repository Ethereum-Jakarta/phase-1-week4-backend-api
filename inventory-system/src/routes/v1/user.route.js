const express = require('express');
const { adminAuth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/api/user.controller');

const router = express.Router();

router
  .route('/')
  .post(adminAuth(), validate(userValidation.createUser), userController.createUser)
  .get(adminAuth(), userController.getUsers);

router
  .route('/:userId')
  .get(adminAuth(), validate(userValidation.getUser), userController.getUser)
  .patch(adminAuth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(adminAuth(), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The email of user
 *         email:
 *           type: string
 *           description: The email of user
 *         password:
 *           type: string
 *           description: The password of user
 */


/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User managing API
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       '201':
 *         description: User Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 201
 *                 message: "Create User Success"
 *                 data: 
 *                  id: "614d234a-b1a8-4759-ab12-9bfe9f225200"
 *                  name: "qqq"
 *                  email: "qqq@gmail.com"
 *                  password: "$2a$08$1abTnb3Z8Q6ZN1oE1zzEseTQimJS6gfjUkpwdihx1HTsNtVGVN9Jy"
 *                  role: "user"
 *                  createdAt: "2024-02-03T13:55:35.124Z"
 *                  updatedAt: "2024-02-03T13:55:35.124Z"
 *       '400':
 *         description: Data Invalid
 *         content:
 *           application/json:
 *             example:
 *                  status: 400
 *                  message: "\"email\" is required, \"password\" is required, \"name\" is required"
 *                  stack: "Error: \"email\" is required, \"password\" is required, \"name\" is required\n at" 
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *                  status: 401
 *                  message: "Please authenticate"
 *                  stack: "Error: Please authenticate\n at"
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *                  status: 403
 *                  message: "You Are Not Admin"
 *                  stack: "Error: You Are Not Admin\n at"
 *
 *   get:
 *     summary: get all user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Get Users Success"
 *                 data:
 *                  id: "614d234a-b1a8-4759-ab12-9bfe9f225200"
 *                  name: "qqq"
 *                  email: "qqq@gmail.com"
 *                  password: "$2a$08$1abTnb3Z8Q6ZN1oE1zzEseTQimJS6gfjUkpwdihx1HTsNtVGVN9Jy"
 *                  role: "user"
 *                  createdAt: "2024-02-03T13:55:35.124Z"
 *                  updatedAt: "2024-02-03T13:55:35.124Z"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *                  status: 401
 *                  message: "Please authenticate"
 *                  stack: "Error: Please authenticate\n at"
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *                  status: 403
 *                  message: "You Are Not Admin"
 *                  stack: "Error: You Are Not Admin\n at"
 * /user/id:
 *   get:
 *     summary: get user by id
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Get User Success"
 *                 data:
 *                  id: "614d234a-b1a8-4759-ab12-9bfe9f225200"
 *                  name: "qqq"
 *                  email: "qqq@gmail.com"
 *                  password: "$2a$08$1abTnb3Z8Q6ZN1oE1zzEseTQimJS6gfjUkpwdihx1HTsNtVGVN9Jy"
 *                  role: "user"
 *                  createdAt: "2024-02-03T13:55:35.124Z"
 *                  updatedAt: "2024-02-03T13:55:35.124Z"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *                  status: 401
 *                  message: "Please authenticate"
 *                  stack: "Error: Please authenticate\n at"
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *                  status: 403
 *                  message: "You Are Not Admin"
 *                  stack: "Error: You Are Not Admin\n at"
 *   patch:
 *     summary: Update a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User Updated
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Update User Success"
 *                 data:
 *                  id: "614d234a-b1a8-4759-ab12-9bfe9f225200"
 *                  name: "rrr"
 *                  email: "rrr@gmail.com"
 *                  password: "$2a$08$1abTnb3Z8Q6ZN1oE1zzEseTQimJS6gfjUkpwdihx1HTsNtVGVN9Jy"
 *                  role: "user"
 *                  createdAt: "2024-02-03T13:55:35.124Z"
 *                  updatedAt: "2024-02-03T13:55:35.124Z"
 *       '400':
 *         description: Data Invalid
 *         content:
 *           application/json:
 *             example:
 *                 status: 400
 *                 message: "\"body\" must have at least 1 key"
 *                 stack: "Error: \"body\" must have at least 1 key\n at"          
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *                 status: 401
 *                 message: "Please authenticate"
 *                 stack: "Error: Please authenticate\n at"
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *                  status: 403
 *                  message: "You Are Not Admin"
 *                  stack: "Error: You Are Not Admin\n at"
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *                 status: 404
 *                 message: "Not found"
 *                 stack: "Error: Not found\n at"
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User Updated
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Delete User Success"
 *                 data: null        
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *                 status: 401
 *                 message: "Please authenticate"
 *                 stack: "Error: Please authenticate\n at"
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *                  status: 403
 *                  message: "You Are Not Admin"
 *                  stack: "Error: You Are Not Admin\n at"
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *                 status: 404
 *                 message: "Not found"
 *                 stack: "Error: Not found\n at"
 */

