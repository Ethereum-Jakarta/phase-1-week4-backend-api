const express = require('express');
const { auth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(productValidation.createProduct), productController.createProduct)
  .get(auth(), validate(productValidation.getAllProducts), productController.getAllProducts);

router
  .route('/:productId')
  .get(auth(), validate(productValidation.getProduct), productController.getProduct)
  .put(auth(), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth(), validate(productValidation.deleteProduct), productController.deleteProduct);

module.exports = router;
