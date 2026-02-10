const express = require('express');
const orderItemController = require('../../controllers/order-item.controller');
const { authAdmin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { orderItemValidation } = require('../../validations/index');

const router = express.Router();

router
  .route('/')
  .post(authAdmin(), validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem)
  .get(authAdmin(), orderItemController.getOrderItem);

router
  .route('/:orderItemId')
  .get(authAdmin(), validate(orderItemValidation.getOrderItemById), orderItemController.getOrderItemById)
  .patch(authAdmin(), validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem)
  .delete(authAdmin(), validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem);

module.exports = router;
