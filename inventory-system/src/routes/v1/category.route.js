const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { categoryValidation } = require('../../validations');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(auth(), validate(categoryValidation.queryCategorys), categoryController.getCategorys);

router
  .route('/:categoryId')
  .get(auth(), validate(categoryValidation.getCategory), categoryController.getCategoryById)
  .put(auth(), validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(auth(), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;
