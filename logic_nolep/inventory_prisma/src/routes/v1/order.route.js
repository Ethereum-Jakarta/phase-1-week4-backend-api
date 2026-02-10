const express = require('express');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');
const orderItemValidation = require('../../validations/orderItem.validation');
const orderItemController = require('../../controllers/orderItem.controller');
const { auth, authorizeRoles } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(auth(), authorizeRoles(), orderController.getOrder)
  .post(auth(), authorizeRoles(), validate(orderValidation.createOrder), orderController.createOrder);

router
  .route('/:orderId')
  .patch(auth(), authorizeRoles(), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth(), authorizeRoles(), validate(orderValidation.deleteOrder), orderController.deleteOrder)
  .get(auth(), authorizeRoles(), validate(orderValidation.getOrder), orderController.getOrderById);

router
  .route('/:orderId/order-items')
  .get(auth(), authorizeRoles(), validate(orderItemValidation.getOrderItemByOrder), orderItemController.getOrderItemByOrder);

module.exports = router;
