const express = require('express');
const { auth, adminAuth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderItemValidation = require('../../validations/orderItem.validation');
const orderItemController = require('../../controllers/orderItem.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), adminAuth(), validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem)
  .get(auth(), adminAuth(), validate(orderItemValidation.getAllOrderItems), orderItemController.getAllOrderItems);

router
  .route('/:orderItemId')
  .get(auth(), adminAuth(), validate(orderItemValidation.getOrderItem), orderItemController.getOrderItem)
  .put(auth(), adminAuth(), validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem)
  .delete(auth(), adminAuth(), validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem);

module.exports = router;
