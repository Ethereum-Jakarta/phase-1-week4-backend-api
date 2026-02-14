const express = require('express');
const { auth, authorizePermissions } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { orderValidation } = require('../../validations');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), authorizePermissions('admin'), orderController.getAllOrders)
  .post(auth(), authorizePermissions('admin'), validate(orderValidation.createOrder), orderController.createOrder);

router
  .route('/:orderId')
  .get(auth(), authorizePermissions('admin'), validate(orderValidation.getOrder), orderController.getOrder)
  .patch(auth(), authorizePermissions('admin'), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth(), authorizePermissions('admin'), validate(orderValidation.deleteOrder), orderController.deleteOrder);

router
  .route('/:orderId/order-items')
  .get(
    auth(),
    authorizePermissions('admin'),
    validate(orderValidation.getOrderItemsByOrderId),
    orderController.getOrderItemsByOrder
  );
module.exports = router;
