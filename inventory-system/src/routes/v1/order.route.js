const express = require('express');
const {auth, authAdmin} = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate')
const orderValidations = require('../../../validations/order.validation')
const orderController = require('../../controllers/order.controller')

const router = express.Router();

router.route('/')
  .get(authAdmin(), orderController.getAllOrders)
  .post(authAdmin(), validate(orderValidations.createOrder), orderController.createOrder)

router.route('/:userId')
    .get(authAdmin(), validate(orderValidations.getOrder), orderController.getOrder)
    .put(authAdmin(), validate(orderValidations.updateOrder), orderController.updateOrder)
    .delete(authAdmin(), validate(orderValidations.deleteOrder), orderController.deleteOrder)

router.route('/:orderId/order-items')
    .get(authAdmin(), validate(orderValidations.getOrder), orderController.getOrder)

module.exports = router;