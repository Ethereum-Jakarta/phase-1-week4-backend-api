const express = require('express');
const { authAdmin } = require('../../middlewares/auth');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router.route('/').get(authAdmin(), orderController.getAll).post(authAdmin(), orderController.create);

router
  .route('/:orderId')
  .get(authAdmin(), orderController.getOrder)
  .patch(authAdmin(), orderController.update)
  .delete(authAdmin(), orderController.remove);

module.exports = router;
