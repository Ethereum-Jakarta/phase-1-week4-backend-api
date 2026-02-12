const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('admin'), validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth(['admin']), orderController.getOrders);
router
  .route('/byUser')
  .get(auth(['admin']), orderController.getOrdersByUser);


router
  .route('/:orderId')
  .get(auth('admin'), validate(orderValidation.getOrder), orderController.getOrder)
  .patch(auth('admin'), validate(orderValidation.updateOrder), orderController.updateOrder)
  .delete(auth('admin'), validate(orderValidation.deleteOrder), orderController.deleteOrder);

module.exports = router;