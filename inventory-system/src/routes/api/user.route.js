const express = require('express');
const { adminAuth } = require('../../middlewares/auth');
const { userValidation } = require('../../validations');
const userController = require('../../controllers/user.controller');
const validate = require('../../middlewares/validate');
const router = express.Router();

router
  .route('/')
  .get(adminAuth(), userController.getAllUsers)
  .post(adminAuth(), validate(userValidation.createUser), userController.createUser);

router
  .route('/:userId')
  .get(adminAuth(), validate(userValidation.getUser), userController.getUser)
  .put(adminAuth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(adminAuth(), validate(userValidation.deleteUser), userController.deleteUser);

router
  .route('/:userId/products')
  .get(adminAuth(), validate(userValidation.getProductsByUser), userController.getProductsByUser);

router.route('/:userId/orders').get(adminAuth(), validate(userValidation.getOrdersByUser), userController.getOrdersByUser);

module.exports = router;
