const express = require('express');
const { auth } = require('../../middlewares/auth');

const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controllers/api/category.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(auth(), categoryController.getCategorys);

router
  .route('/:categoryId')
  .get(auth(), validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(auth(), validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(auth(), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of category
 */


/**
 * @swagger
 * tags:
 *   name: Category
 *   description: The Category managing API
 * /category:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       '201':
 *         description: Category Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 201
 *                 message: "Create Category Success"
 *                 data: 
 *                  id: "234a1fa8-0d36-4d7b-a363-0c42fbfc4e9e"
 *                  name: "Snack"
 *                  createdAt: "2024-02-03T13:55:35.124Z"
 *                  updatedAt: "2024-02-03T13:55:35.124Z"
 *       '400':
 *         description: Data Invalid
 *         content:
 *           application/json:
 *             example:
 *                  status: 400
 *                  message: "\"name\" is required"
 *                  stack: "Error: \"name\" is required\n at"
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *                  status: 401
 *                  message: "Please authenticate"
 *                  stack: "Error: Please authenticate\n at"
 *
 *   get:
 *     summary: get all category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       '200':
 *         description: Category Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Get Categorys Success"
 *                 data:
 *                  id: "234a1fa8-0d36-4d7b-a363-0c42fbfc4e9e"
 *                  name: "Snack"
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
 * /category/id:
 *   get:
 *     summary: get category by id
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       '200':
 *         description: Category Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Get Categorys Success"
 *                 data:
 *                  id: "234a1fa8-0d36-4d7b-a363-0c42fbfc4e9e"
 *                  name: "Snack"
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
 *   patch:
 *     summary: Update a category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       '200':
 *         description: Category Updated
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Update Category Success"
 *                 data:
 *                  id: "bb810c6c-3a16-4b2d-b1bf-765ab102af06"
 *                  name: "Shirt"
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
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *                 status: 404
 *                 message: "Not found"
 *                 stack: "Error: Not found\n at"
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       '200':
 *         description: Category Updated
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Delete Category Success"
 *                 data: null        
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *                 status: 401
 *                 message: "Please authenticate"
 *                 stack: "Error: Please authenticate\n at"
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *                 status: 404
 *                 message: "Not found"
 *                 stack: "Error: Not found\n at"
 */





