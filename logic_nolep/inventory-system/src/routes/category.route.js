const express = require('express');

const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router
  .route('/')
  .get(authenticate(), authorize(['user', 'admin']), categoryController.getCategories)
  .post(authenticate(), authorize(['user', 'admin']), categoryController.createCategory);

router
  .route('/:id')
  .get(authenticate(), authorize(['user', 'admin']), categoryController.getCategory)
  .put(authenticate(), authorize(['user', 'admin']), categoryController.updateCategory)
  .delete(authenticate(), authorize(['user', 'admin']), categoryController.deleteCategory);

module.exports = router;
