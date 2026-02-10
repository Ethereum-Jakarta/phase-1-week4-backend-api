const express = require('express');
const { auth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router.route('/categories').get(auth(), productController.searchProductByCategory);

router
  .route('/')
  .post(auth(), validate(productValidation.createProduct), productController.createProduct)
  .get(auth(), productController.getProduct);

router
  .route('/:productId')
  .get(auth(), productController.getProductById)
  .patch(auth(), productController.updateProduct)
  .delete(auth(), productController.deleteProduct);


module.exports = router;
