const express = require('express');
const { adminAuth, auth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderItemValidation = require('../../validations/orderItem.validation');
const orderItemController = require('../../controllers/api/orderItem.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem)
  .get(auth(), orderItemController.getOrderItems);

router
  .route('/:orderItemId')
  .get(auth(), validate(orderItemValidation.getOrderItem), orderItemController.getOrderItem)
  .patch(auth(), validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem)
  .delete(auth(), validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem);

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - orderId
 *         - productId
 *         - quantity
 *         - unitPrice
 *       properties:
 *         orderId:
 *           type: uuid
 *           description: The order of orderitem
 *         productId:
 *           type: uuid
 *           description: The product of orderitem
 *         quantity:
 *           type: int
 *           description: The quantity product of orderitem
 *         unitPrice:
 *           type: float
 *           description: The unit price product of orderitem
 */


/**
 * @swagger
 * tags:
 *   name: OrderItem
 *   description: The OrderItem managing API
 * /order-item:
 *   post:
 *     summary: Create a new orderitem
 *     tags: [OrderItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/orderitem'
 *     responses:
 *       '201':
 *         description: OrderItem Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 201
 *                 message: "Create OrderItem Success"
 *                 data: 
 *                  id: "9c170176-c8c2-4ead-8b78-a8356dba0316"
 *                  orderId: "b347ed58-3b82-4b46-8eeb-3c65a519e0c4"
 *                  productId: "a525a2ee-f460-4633-bcb1-c138c7916073"
 *                  quantity: 3
 *                  unitPrice: 100000
 *                  createdAt: "2024-02-03T13:55:35.124Z"
 *                  updatedAt: "2024-02-03T13:55:35.124Z"
 *       '400':
 *         description: Data Invalid
 *         content:
 *           application/json:
 *             example:
 *                  status: 400
 *                  message: "\"quantity\" is required, \"unitPrice\" is required"
 *                  stack: "Error: \"quantity\" is required, \"unitPrice\" is required\n at"
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
 *     summary: get all orderitem
 *     tags: [OrderItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       '200':
 *         description: OrderItem Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Get OrderItems Success"
 *                 data:
 *                  id: "9c170176-c8c2-4ead-8b78-a8356dba0316"
 *                  orderId: "b347ed58-3b82-4b46-8eeb-3c65a519e0c4"
 *                  productId: "a525a2ee-f460-4633-bcb1-c138c7916073"
 *                  quantity: 3
 *                  unitPrice: 100000
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
 * /order-item/id:
 *   get:
 *     summary: get orderitem by id
 *     tags: [OrderItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       '200':
 *         description: OrderItem Created
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Get OrderItems Success"
 *                 data:
 *                  id: "9c170176-c8c2-4ead-8b78-a8356dba0316"
 *                  orderId: "b347ed58-3b82-4b46-8eeb-3c65a519e0c4"
 *                  productId: "a525a2ee-f460-4633-bcb1-c138c7916073"
 *                  quantity: 3
 *                  unitPrice: 100000
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
 *     summary: Update a orderitem
 *     tags: [OrderItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       '200':
 *         description: OrderItem Updated
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Update OrderItem Success"
 *                 data:
 *                  id: "9c170176-c8c2-4ead-8b78-a8356dba0316"
 *                  orderId: "b347ed58-3b82-4b46-8eeb-3c65a519e0c4"
 *                  productId: "a525a2ee-f460-4633-bcb1-c138c7916073"
 *                  quantity: 4
 *                  unitPrice: 200000
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
 *     summary: Delete a orderitem
 *     tags: [OrderItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       '200':
 *         description: OrderItem Updated
 *         content:
 *           application/json:
 *             example:
 *                 status: 200
 *                 message: "Delete OrderItem Success"
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

