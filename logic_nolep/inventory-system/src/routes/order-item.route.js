const express = require('express');

const router = express.Router();
const orderItemController = require('../controllers/order-item.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(authenticate(), authorize(['admin']), orderItemController.getOrderItems)
  .post(authenticate(), authorize(['admin']), orderItemController.createOrderItem);

router
  .route('/:id')
  .get(authenticate(), authorize(['admin']), orderItemController.getOrderItem)
  .put(authenticate(), authorize(['admin']), orderItemController.updateOrderItem)
  .delete(authenticate(), authorize(['admin']), orderItemController.deleteOrderItem);

module.exports = router;
