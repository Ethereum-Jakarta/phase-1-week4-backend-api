const express = require('express');
const auth = require('../../middlewares/auth');
const authorize = require('../../middlewares/authorize');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), authorize(['admin', 'user']), validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(auth(), authorize(['admin', 'user']), categoryController.getCategorys);

router
  .route('/:categoryId')
  .get(auth(), authorize(['admin', 'user']), validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(
    auth(),
    authorize(['admin', 'user']),
    validate(categoryValidation.updateCategory),
    categoryController.updateCategory,
  )
  .delete(
    auth(),
    authorize(['admin', 'user']),
    validate(categoryValidation.deleteCategory),
    categoryController.deleteCategory,
  );

module.exports = router;
