const express = require('express');
const { auth, adminAuth } = require('../../middlewares/auth');

const router = express.Router();
const userController = require('../../controllers/user.controller');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');

router
  .route('/')
  .get(auth(), adminAuth(), validate(userValidation.getAllUsers), userController.getAllUsers)
  .post(auth(), adminAuth(), validate(userValidation.createUser), userController.createUser);
router
  .route('/:userId')
  .get(auth(), adminAuth(), validate(userValidation.getUser), userController.getUserById)
  .put(auth(), adminAuth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), adminAuth(), validate(userValidation.deleteUser), userController.deleteUser);

router.get('/:userId/products', auth(), adminAuth(), validate(userValidation.getUser), userController.getProductByUser);
router.get('/:userId/orders', auth(), adminAuth(), validate(userValidation.getUser), userController.getOrderByUser);
module.exports = router;
