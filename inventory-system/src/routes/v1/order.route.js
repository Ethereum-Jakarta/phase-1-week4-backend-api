const express = require('express');
const { auth, adminAuth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/api/order.controller');

const router = express.Router();

router
  .route('/')
  .post(adminAuth(), validate(orderValidation.createOrder), orderController.createOrder)
  .get(adminAuth(), orderController.getOrders);

router
  .route('/:orderId')
  .get(adminAuth(), validate(orderValidation.getOrder), orderController.getOrder)
  .patch(adminAuth(), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(adminAuth(), validate(orderValidation.deleteOrder), orderController.deleteOrder);

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - quantityInStock
 *         - categoryId
 *         - userId
 *       properties:
 *         totalPrice:
 *           type: float
 *           description: The total price of order
 *         date:
 *           type: date
 *           description: The date of order
 *         customerName:
 *           type: float
 *           description: The customer name of order
 *         customerEmail:
 *           type: string
 *           description: The customer email of order
 *         userId:
 *           type: uuid
 *           description: The user who input the order
 */


/**
 * @swagger
 * tags:
 *   name: Order
 *   description: The Order managing API
 * /order:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/order'
 *     responses:
 *       '201':
 *         description: Order Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 201
 *                 message: "Create Order Success"
 *                 data: 
 *                  id: "9c170176-c8c2-4ead-8b78-a8356dba0316"
 *                  date:  "2023-01-01T00:00:00.000Z"
 *                  totalPrice: 0
 *                  customerName: "asep"
 *                  customerEmail: "asep@gmail.com"
 *                  userId: "736edf9e-66c3-43de-b280-4ccda7a3d1ee" 
 *                  createdAt: "2024-02-03T13:55:35.124Z"
 *                  updatedAt: "2024-02-03T13:55:35.124Z"
 *       '400':
 *         description: Data Invalid
 *         content:
 *           application/json:
 *             example:
 *                  status: 400
 *                  message: "\"date\" is required, \"totalPrice\" is required, \"customerName\" is required, \"customerEmail\" is required"
 *                  stack: "Error: \"date\" is required, \"totalPrice\" is required, \"customerName\" is required, \"customerEmail\" is required\n at"
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
 *     summary: get all order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       '200':
 *         description: Order Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Get Orders Success"
 *                 data:
 *                  id: "9c170176-c8c2-4ead-8b78-a8356dba0316"
 *                  date:  "2023-01-01T00:00:00.000Z"
 *                  totalPrice: 0
 *                  customerName: "asep"
 *                  customerEmail: "asep@gmail.com"
 *                  userId: "736edf9e-66c3-43de-b280-4ccda7a3d1ee" 
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
 * /order/id:
 *   get:
 *     summary: get order by id
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       '200':
 *         description: Order Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Get Orders Success"
 *                 data:
 *                  id: "9c170176-c8c2-4ead-8b78-a8356dba0316"
 *                  date:  "2023-01-01T00:00:00.000Z"
 *                  totalPrice: 0
 *                  customerName: "asep"
 *                  customerEmail: "asep@gmail.com"
 *                  userId: "736edf9e-66c3-43de-b280-4ccda7a3d1ee" 
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
 *     summary: Update a order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       '200':
 *         description: Order Updated
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Update Order Success"
 *                 data:
 *                  id: "5d3a5a9e-bd2b-4e9b-9cae-1e807f6ff8ec"
 *                  name:  "baju pololo"
 *                  description: "baju keren merk pololo"
 *                  price: 250000
 *                  quantityInStock: 35
 *                  categoryId: "6c448130-6036-4535-acac-b7c2384e8a34"
 *                  userId: "40490dd6-502a-4183-a595-a38616c2c477" 
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
 *     summary: Delete a order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       '200':
 *         description: Order Updated
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Delete Order Success"
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



