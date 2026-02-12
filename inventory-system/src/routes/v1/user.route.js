const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(userValidation.createUser), userController.createUser)
  .get(auth(), userController.getUsers);

router
   .route('/:userId/order')
   .get(auth(), validate(userValidation.getUser), userController.getOrdersByUser)
router
  .route('/:userId/product')
  .get(auth(), validate(userValidation.getUser), userController.getProductsByUser)

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getUser), userController.findUser)
  .patch(auth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;