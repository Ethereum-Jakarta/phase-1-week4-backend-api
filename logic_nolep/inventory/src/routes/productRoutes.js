const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProductByCategory } = require('../controllers/productController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { productValidation } = require('../validations');

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('Admin'), validate(productValidation.createProduct), createProduct);
router.get('/', authenticateToken, getAllProducts);
router.get('/search', authenticateToken, searchProductByCategory);
router.get('/:productId', authenticateToken, validate(productValidation.getProduct), getProductById);
router.put('/:productId', authenticateToken, authorizeRoles('Admin'), validate(productValidation.updateProduct), updateProduct);
router.delete('/:productId', authenticateToken, authorizeRoles('Admin'), validate(productValidation.deleteProduct), deleteProduct);

module.exports = router;
