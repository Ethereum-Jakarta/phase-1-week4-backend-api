const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { orderItemValidation } = require('../../validations');
const orderItemController = require('../../controllers/orderItem.controller');
const authorize = require('../../middlewares/authorize');

const router = express.Router();

router
  .route('/')
  .post(auth(), authorize, validate(orderItemValidation.create), orderItemController.create)
  .get(auth(), authorize, validate(orderItemValidation.getAll), orderItemController.getAll);

router
  .route('/:orderItemId')
  .get(auth(), authorize, validate(orderItemValidation.getId), orderItemController.getId)
  .put(auth(), authorize, validate(orderItemValidation.update), orderItemController.update)
  .delete(auth(), authorize, validate(orderItemValidation.deleted), orderItemController.deleted);

module.exports = router;
