const express = require('express');
const {auth, authAdmin} = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate')
const productValidations = require('../../../validations/product.validation')
const productController = require('../../controllers/product.controller')

const router = express.Router();

router.route('/')
  .get(authAdmin(), productController.getAllProduct)
  .post(authAdmin(), validate(productValidations.createProduct), productController.createProduct)

router.route('/:productId')
    .get(authAdmin(), validate(productValidations.getProduct), productController.getProduct)
    .put(authAdmin(), validate(productValidations.updateProduct), productController.updateProduct)
    .delete(authAdmin(), validate(productValidations.deleteProduct), productController.deleteProduct)

module.exports = router;