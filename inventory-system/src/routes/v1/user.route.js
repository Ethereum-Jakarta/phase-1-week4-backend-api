const express = require('express');
const userController = require('../../controllers/user.controller');
const { authAdmin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations/index');

const router = express.Router();

router.route('/').get(authAdmin(), userController.getAllUsers);

router
  .route('/:userId')
  .get(authAdmin(), validate(userValidation.getUserById), userController.getUserById)
  .patch(authAdmin(), validate(userValidation.updateUser), userController.updateUser)
  .delete(authAdmin(), validate(userValidation.deleteUser), userController.deleteUser);

router
  .route('/:userId/products')
  .get(authAdmin(), validate(userValidation.getProductByUser), userController.getProductByUser);

router.route('/:userId/orders').get(authAdmin(), validate(userValidation.getOrdersByUser), userController.getOrderByUser);

module.exports = router;
