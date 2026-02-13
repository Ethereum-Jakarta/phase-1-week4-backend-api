import CategoryService from '../services/category.service.js';
import logger from '../config/logger.js';

class CategoryController {
  static async createCategory(req, res) {
    const { name } = req.body;

    try {
      const category = await CategoryService.create({ name });

      res.status(201).json({
        message: 'Category Create Successfully',
        category,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to create category!!',
      });
    }
  }

  static async updateCategory(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const category = await CategoryService.update(id, { name });

      res.json({
        message: 'Category updated successfully',
        category,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to update category!!',
      });
    }
  }

  static async hardDeleteCategory(req, res) {
    const { id } = req.params;

    try {
      const category = await CategoryService.hardDelete(id);

      res.json({
        message: `Delete ${id} Category Successfully`,
        category,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to delete ${id} category!!`,
      });
    }
  }

  static async softDeleteCategory(req, res) {
    const { id } = req.params;

    try {
      const category = await CategoryService.softDelete(id);

      res.json({
        message: `Soft Delete {id} Category Successfully`,
        category,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to soft delete ${id} category!!`,
      });
    }
  }

  static async getAllCategories(req, res) {
    try {
      const category = await CategoryService.getAll();

      res.json({
        message: 'Get All Data Categories Successfully',
        category,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to get all data categories!!',
      });
    }
  }

  static async findCategoryByID(req, res) {
    const { id } = req.params;

    try {
      const category = await CategoryService.findByID(id);

      res.json({
        message: `Get Detail ${id} Category Successfully`,
        category,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to get detail ${id} category!!`,
      });
    }
  }
}

export default CategoryController;
