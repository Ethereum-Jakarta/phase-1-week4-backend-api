const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { productValidation } = require('../../validations');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router
  .route('/category-search')
  .get(auth(), validate(productValidation.getProductByCategory), productController.getProductByCategory);

router
  .route('/')
  .post(auth(), validate(productValidation.create), productController.create)
  .get(auth(), validate(productValidation.getAll), productController.read);

router
  .route('/:productId')
  .get(auth(), validate(productValidation.getId), productController.readId)
  .put(auth(), validate(productValidation.update), productController.update)
  .delete(auth(), validate(productValidation.deleted), productController.deleted);

module.exports = router;
