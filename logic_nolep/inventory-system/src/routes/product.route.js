const express = require('express');

const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(authenticate(), authorize(['user', 'admin']), productController.getProducts)
  .post(authenticate(), authorize(['user', 'admin']), productController.createProduct);

router
  .route('/:id')
  .get(authenticate(), authorize(['user', 'admin']), productController.getProduct)
  .put(authenticate(), authorize(['user', 'admin']), productController.updateProduct)
  .delete(authenticate(), authorize(['user', 'admin']), productController.deleteProduct);

module.exports = router;
