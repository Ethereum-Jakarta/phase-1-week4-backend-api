import { Router } from 'express';
import ProductController from '../controllers/product.controller.js';

const router = Router();

router.route('/products').post(ProductController.createProduct).get(ProductController.getAllProduct);

router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.hardDeleteProduct);
router.get('/products/:id', ProductController.findProductByID);
router.get('/users/:userId/products', ProductController.findProductByUser);
router.patch('/products/:id', ProductController.softDelete);

export default router;
