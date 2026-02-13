import { Router } from 'express';
import CategoryController from '../controllers/category.controller.js';

const router = Router();

router.route('/categories').post(CategoryController.createCategory).get(CategoryController.getAllCategories);

router.put('/categories/:id', CategoryController.updateCategory);
router.delete('/categories/:id', CategoryController.hardDeleteCategory);
router.get('/categories/:id', CategoryController.findCategoryByID);
router.patch('/categories/:id', CategoryController.softDeleteCategory);

export default router;
