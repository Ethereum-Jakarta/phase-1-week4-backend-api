const express = require('express');
const auth = require('../../middlewares/auth');
const authorize = require('../../middlewares/authorize');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), authorize(['admin', 'user']), validate(productValidation.createProduct), productController.createProduct)
  .get(auth(), authorize(['admin', 'user']), productController.getAllProducts);

router
  .route('/:productId')
  .get(auth(), authorize(['admin', 'user']), validate(productValidation.getProduct), productController.getProduct)
  .patch(auth(), authorize(['admin', 'user']), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth(), authorize(['admin', 'user']),  validate(productValidation.deleteProduct), productController.deleteProduct);

router
  .route('/search')
  .get(
    auth(),
    authorize(['admin', 'user']),
    validate(productValidation.getProductsByCategory),
    productController.getProductsByCategory,
  );

module.exports = router;
