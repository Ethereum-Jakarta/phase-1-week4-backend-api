const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { orderValidation } = require('../../validations');
const orderController = require('../../controllers/order.controller');
const authorize = require('../../middlewares/authorize');

const router = express.Router();

router
  .route('/')
  .post(auth(), authorize, validate(orderValidation.create), orderController.create)
  .get(auth(), authorize, validate(orderValidation.getAll), orderController.getAll);

router
  .route('/:orderId')
  .get(auth(), authorize, validate(orderValidation.getId), orderController.getId)
  .put(auth(), authorize, validate(orderValidation.update), orderController.update)
  .delete(auth(), authorize, validate(orderValidation.deleted), orderController.deleted);

module.exports = router;
