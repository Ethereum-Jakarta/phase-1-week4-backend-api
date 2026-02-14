const express = require('express');
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { categoryValidation } = require('../validations');

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('Admin'), validate(categoryValidation.createCategory), createCategory);
router.get('/', authenticateToken, getAllCategories);
router.get('/:categoryId', authenticateToken, validate(categoryValidation.getCategory), getCategoryById);
router.put('/:categoryId', authenticateToken, authorizeRoles('Admin'), validate(categoryValidation.updateCategory), updateCategory);
router.delete('/:categoryId', authenticateToken, authorizeRoles('Admin'), validate(categoryValidation.deleteCategory), deleteCategory);

module.exports = router;
