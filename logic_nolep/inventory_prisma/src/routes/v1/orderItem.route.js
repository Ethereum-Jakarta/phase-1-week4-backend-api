const express = require('express');
const validate = require('../../middlewares/validate');
const orderItemValidation = require('../../validations/orderItem.validation');
const orderItemController = require('../../controllers/orderItem.controller');
const { auth, authorizeRoles } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(auth(), authorizeRoles(), orderItemController.getOrderItem)
  .post(auth(), authorizeRoles(), validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem);

router
  .route('/:orderItemId')
  .patch(auth(), authorizeRoles(), validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem)
  .delete(auth(), authorizeRoles(), validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem)
  .get(auth(), authorizeRoles(), validate(orderItemValidation.getOrderItem), orderItemController.getOrderItemById);

module.exports = router;
