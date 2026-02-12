const express = require('express');
const { orderValidation } = require('../../validations');
const orderController = require('../../controllers/order.controller');
const validate = require('../../middlewares/validate');
const { adminAuth } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(adminAuth(), orderController.getAllOrders)
  .post(adminAuth(), validate(orderValidation.createOrder), orderController.createOrder);

router
  .route('/:orderId')
  .get(adminAuth(), validate(orderValidation.getOrder), orderController.getOrder)
  .put(adminAuth(), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(adminAuth(), validate(orderValidation.deleteOrder), orderController.deleteOrder);

router
  .route('/:orderId/order-items')
  .get(adminAuth(), validate(orderValidation.getOrderItemsByOrder), orderController.getOrderItemsByOrder)

module.exports = router;
