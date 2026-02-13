const express = require('express');
const { auth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const productValidation = require('../validations/product.validation');
const productController = require('../controllers/product.controller');
const { category } = require('../../prisma');
const { checkAuthenticate } = require('../middlewares/checkAuth');

const router = express.Router();


router
  .route('/')
  .get(
    checkAuthenticate, 
        productController.viewProduct);

router
  .route('/add')
  .get(
    checkAuthenticate, 
        productController.addProduct)
  .post(
    checkAuthenticate, 
    productController.postProduct)

router
  .route('/detail/:productId')
  .get(checkAuthenticate, productController.detailProduct)

router
  .route('/edit/:productId')
  .get(checkAuthenticate, productController.editProduct)
  .patch(checkAuthenticate, productController.updateProduct)
  .delete(checkAuthenticate, productController.deleteProduct)

router
  .route('/search')
  .get(checkAuthenticate, productController.searchProduct)


// router
//   .route('/:productId')
//   .get(
//     //auth(),
//      validate(productValidation.getProduct), productController.getProduct)
//   .patch(
//     //auth(),
//      validate(productValidation.updateProduct), productController.updateProduct)
//   .delete(
//     //auth(),
//      validate(productValidation.deleteProduct), productController.deleteProduct);

module.exports = router;
