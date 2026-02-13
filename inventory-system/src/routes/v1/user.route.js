const express = require('express');
const {auth, authAdmin} = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate')
const userValidation = require('../../../validations/user.validation');
const userController = require('../../controllers/user.controller');


const router = express.Router();

router
    .route('/')
    .post(auth(), authAdmin(), validate(userValidation.createUser), userController.createUser)
    .get(auth(), authAdmin(), userController.getUsers);

router
    .route('/:userId')
    .get(auth(), authAdmin(), validate(userValidation.getUser), userController.getUser)
    .put(auth(), authAdmin(), validate(userValidation.updateUser), userController.updateUser)
    .delete(auth(), authAdmin(), validate(userValidation.deleteUser), userController.deleteUser);

router
    .route('/:userId/products')
    .get(auth(), authAdmin(), validate(userValidation.getUser), userController.getProductByUser)

router
    .route('/:userId/orders')
    .get(auth(), authAdmin(), validate(userValidation.getUser), userController.getOrderByUser)


module.exports = router;