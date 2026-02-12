const express = require('express');
const orderItemController = require('../../controllers/orderItem.controller');
const { orderItemValidation } = require('../../validations');
const validate = require('../../middlewares/validate');
const { adminAuth } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(adminAuth(), orderItemController.getAllOrderItems)
  .post(adminAuth(), validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem);

router
  .route('/:orderItemId')
  .get(adminAuth(), validate(orderItemValidation.getOrderItem), orderItemController.getOrderItem)
  .delete(adminAuth(), validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem)
  .put(adminAuth(), validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem);

module.exports = router;
