const express = require('express');
const auth = require('../../middlewares/auth');
const authorize = require('../../middlewares/authorize');
const validate = require('../../middlewares/validate');
const { orderItemValidation } = require('../../validations');
const orderItemController = require('../../controllers/orderItem.controller');

const router = express.Router();

router.route('/').get(auth(), authorize(['admin']), orderItemController.getAllOrderItems);

router
  .route('/:orderItemId')
  .get(auth(), authorize(['admin']), validate(orderItemValidation.getOrderItem), orderItemController.getOrderItemById)
  .patch(auth(), authorize(['admin']), validate(orderItemValidation.updateOrderItem), orderItemController.updateOrderItem)
  .delete(auth(), authorize(['admin']), validate(orderItemValidation.deleteOrderItem), orderItemController.deleteOrderItem);



module.exports = router;
