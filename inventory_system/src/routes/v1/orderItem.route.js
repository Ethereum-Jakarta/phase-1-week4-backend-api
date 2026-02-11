const express = require('express');
const { authAdmin } = require('../../middlewares/auth');
const orderItemController = require('../../controllers/orderItem.controller');

const router = express.Router();

router.route('/').get(authAdmin(), orderItemController.queryOrderItems).post(authAdmin(), orderItemController.create);

router
  .route('/:orderItemId')
  .get(authAdmin(), orderItemController.getOrderItem)
  .patch(authAdmin(), orderItemController.update)
  .delete(authAdmin(), orderItemController.remove);

module.exports = router;
