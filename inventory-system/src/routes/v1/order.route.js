const express = require('express');
const { auth, adminAuth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), adminAuth(), validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth(), adminAuth(), validate(orderValidation.getAllOrders), orderController.getAllOrders);

router
  .route('/:orderId')
  .get(auth(), adminAuth(), validate(orderValidation.getOrder), orderController.getOrder)
  .put(auth(), adminAuth, validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth(), adminAuth(), validate(orderValidation.deleteOrder), orderController.deleteOrder);

router.get(
  '/:orderId/order-items',
  auth(),
  adminAuth(),
  validate(orderValidation.getOrder),
  orderController.getOrderItemByOrder
);
module.exports = router;
