const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');
const { auth, authorizeRoles } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(auth(), authorizeRoles(), userController.getUser)
  .post(auth(), authorizeRoles(), validate(userValidation.createUser), userController.createUser);

router
  .route('/:userId')
  .get(auth(), authorizeRoles(), validate(userValidation.getUser), userController.findUserbyId)
  .patch(auth(), authorizeRoles(), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), authorizeRoles(), validate(userValidation.deleteUser), userController.deleteUser);

router
  .route('/:userId/products')
  .get(auth(), validate(productValidation.getProductByUser), productController.getProductByUser);

router
  .route('/:userId/orders')
  .get(auth(), authorizeRoles(), validate(orderValidation.getOrderByUser), orderController.getOrderByUser);

module.exports = router;
