const express = require('express');
const { auth } = require('../middlewares/auth');

const validate = require('../middlewares/validate');
const categoryValidation = require('../validations/category.validation');
const categoryController = require('../controllers/category.controller');
const { checkAuthenticate } = require('../middlewares/checkAuth');

const router = express.Router();

router
  .route('/')
  .get(
    checkAuthenticate, 
        categoryController.viewCategory);

router
  .route('/add')
  .get(
    checkAuthenticate, 
        categoryController.addCategory)
  .post(
    checkAuthenticate, 
    categoryController.postCategory)

router
  .route('/detail/:categoryId')
  .get(
    checkAuthenticate,  
       // validate(categoryValidation.getCategory),
         categoryController.detailCategory)

router
  .route('/edit/:categoryId')
  .get(categoryController.editCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory)

router
  .route('/search')
  .get(categoryController.searchCategory)
// router
//   .route('/add')
//   .post(
//     //auth(), 
//         validate(categoryValidation.createCategory), categoryController.createCategory)

// router
//   .route('/edit/:categoryId')
//   .patch(
//      //auth(), 
//        validate(categoryValidation.updateCategory), categoryController.updateCategory)

// router
//   .route('/delete/:categoryId')
//   .delete(
//     //auth(), 
//        validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;
