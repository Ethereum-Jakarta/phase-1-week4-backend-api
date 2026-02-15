const express = require('express');
const auth = require('../../middlewares/auth');
const authorize = require('../../middlewares/authorize')
const validate = require('../../middlewares/validate');
const { userValidation, productValidation, orderValidation } = require('../../validations');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.route('/').get(auth(), userController.getAllUsers);

router
  .route('/:userId')
  .get(auth(), authorize(['admin']), validate(userValidation.getUserById), userController.getUserById)
  .patch(auth(), authorize(['admin']), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), authorize(['admin']), validate(userValidation.deleteUser), userController.deleteUser);

router
  .route('/:userId/products')
  .get(auth(), authorize(['admin']), validate(productValidation.getProductsByUser), userController.getProductsByUser);

router
  .route('/:userId/orders')
  .get(auth(), authorize(['admin']), validate(orderValidation.getOrdersByUser), userController.getOrdersByUser);
module.exports = router;
