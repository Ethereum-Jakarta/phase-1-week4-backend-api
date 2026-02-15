const express = require('express');
const auth = require('../../middlewares/auth');
const authorize = require('../../middlewares/authorize');
const validate = require('../../middlewares/validate');
const {orderValidation, orderItemValidation} = require('../../validations');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), authorize(['admin']), validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth(), authorize(['admin']), orderController.getAllOrders);

router
  .route('/:orderId')
  .get(auth(), authorize(['admin']), validate(orderValidation.getOrder), orderController.getOrderById)
  .patch(auth(), authorize(['admin']), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth(), authorize(['admin']), validate(orderValidation.deleteOrder), orderController.deleteOrder);

router
  .route('/:orderId/order-items')
  .get(
    auth(),
    authorize(['admin']),
    validate(orderItemValidation.getOrderItemsByOrder),
    orderController.getOrderItemsByOrder,
  );
  
module.exports = router;
