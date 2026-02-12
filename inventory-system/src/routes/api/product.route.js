const express = require('express');
const { auth } = require('../../middlewares/auth');
const { productValidation } = require('../../validations');
const productController = require('../../controllers/product.controller');
const validate = require('../../middlewares/validate');
const router = express.Router();

router
  .route('/')
  .get(auth(), productController.getAllProducts)
  .post(auth(), validate(productValidation.createProduct), productController.createProduct);

router
  .route('/:productId')
  .get(auth(), validate(productValidation.getProduct), productController.getProduct)
  .put(auth(), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth(), validate(productValidation.deleteProduct), productController.deleteProduct);

module.exports = router;
