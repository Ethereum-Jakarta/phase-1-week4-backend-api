const express = require('express');
const {auth, authAdmin} = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate')
const orderItemValidations = require('../../../validations/orderItem.validation')
const orderItemController = require('../../controllers/orderItem.controller')

const router = express.Router();

router.route('/')
  .get(authAdmin(), orderItemController.getAllOrderItems)
  .post(authAdmin(), validate(orderItemValidations.createOrderItem), orderItemController.createOrderItem)

router.route('/:orderItemId')
    .get(authAdmin(), validate(orderItemValidations.getOrderItem), orderItemController.getOrderItem)
    .put(authAdmin(), validate(orderItemValidations.updateOrderItem), orderItemController.updateOrderItem)
    .delete(authAdmin(), validate(orderItemValidations.deleteOrderItem), orderItemController.deleteOrderItem)

module.exports = router;