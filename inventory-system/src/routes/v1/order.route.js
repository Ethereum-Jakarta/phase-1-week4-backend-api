const express = require('express');
const orderController = require('../../controllers/order.controller');
const { authAdmin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { orderValidation } = require('../../validations/index');

const router = express.Router();

router
  .route('/')
  .post(authAdmin(), validate(orderValidation.createOrder), orderController.createOrder)
  .get(authAdmin(), orderController.getProduct);

router
  .route('/:orderId')
  .get(authAdmin(), validate(orderValidation.getOrderById), orderController.getOrderById)
  .patch(authAdmin(), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(authAdmin(), validate(orderValidation.deleteOrder), orderController.deleteOrder);

module.exports = router;
