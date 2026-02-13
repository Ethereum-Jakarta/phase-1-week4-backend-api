const express = require('express');
const {auth, authAdmin} = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate')
const categoryValidations = require('../../../validations/category.validation')
const categoryController = require('../../controllers/category.controller')

const router = express.Router();

router.route('/')
  .get(authAdmin(), categoryController.getAllCategory)
  .post(authAdmin(), validate(categoryValidations.createCategory), categoryController.createCategory)

router.route('/:categoryId')
    .get(authAdmin(), validate(categoryValidations.getCategory), categoryController.getCategoryById)
    .put(authAdmin(), validate(categoryValidations.updateCategory), categoryController.updateCategoryById)
    .delete(authAdmin(), validate(categoryValidations.deleteCategory), categoryController.deleteCategorys)

module.exports = router;