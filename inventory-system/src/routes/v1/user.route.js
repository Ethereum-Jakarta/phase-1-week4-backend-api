const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations');
const userController = require('../../controllers/user.controller');
const authorize = require('../../middlewares/authorize');

const router = express.Router();

router
  .route('/')
  .post(auth(), authorize, validate(userValidation.create), userController.create)
  .get(auth(), authorize, validate(userValidation.getAll), userController.getAll);

router
  .route('/:userId')
  .get(auth(), authorize, validate(userValidation.getId), userController.getId)
  .put(auth(), authorize, validate(userValidation.update), userController.update)
  .delete(auth(), authorize, validate(userValidation.deleted), userController.deleted);

router.route('/:userId/products').get(auth(), authorize, validate(userValidation.getProducts), userController.getProducts);
router.route('/:userId/orders').get(auth(), authorize, validate(userValidation.getOrders), userController.getOrders);

module.exports = router;
