import ProductService from '../services/product.service.js';
import logger from '../config/logger.js';

class ProductController {
  static async createProduct(req, res) {
    const { name, description, price, quantityInStock, categoryId, userId } = req.body;
    const parsedPrice = Number(price);
    const parsedQuantityInStock = Number(quantityInStock);

    if (isNaN(parsedPrice) || isNaN(parsedQuantityInStock)) {
      return res.status(400).json({
        message: 'Price dan Quantity Stock Harus Berupa Angka!!',
      });
    }

    try {
      const product = await ProductService.create({
        name,
        description,
        price: parsedPrice,
        quantityInStock: parsedQuantityInStock,
        categoryId,
        userId,
      });

      res.status(201).json({
        message: 'Product created successfully',
        product,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to create product!!',
      });
    }
  }

  static async updateProduct(req, res) {
    const { id } = req.params;
    const { name, description, price, quantityInStock, categoryId, userId } = req.body;
    const parsedPrice = Number(price);
    const parsedQuantityInStock = Number(quantityInStock);

    try {
      const product = await ProductService.update(id, {
        name,
        description,
        price: parsedPrice,
        quantityInStock: parsedQuantityInStock,
        categoryId,
        userId,
      });

      res.json({
        message: 'Product updated successfully',
        product,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to update product!!',
      });
    }
  }

  static async hardDeleteProduct(req, res) {
    const { id } = req.params;

    try {
      const product = await ProductService.hardDelete(id);

      res.json({
        message: `Delete ${id} Product Successfully`,
        product,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to delete ${id} product!!`,
      });
    }
  }

  static async softDelete(req, res) {
    const { id } = req.params;

    try {
      const product = await ProductService.softDelete(id);

      res.json({
        message: `Soft Delete ${id} Product Successfully`,
        product,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to soft delete ${id} product!!`,
      });
    }
  }

  static async getAllProduct(req, res) {
    try {
      const product = await ProductService.getAll();

      res.json({
        message: 'Get all products successfully',
        product,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to get all products!!',
      });
    }
  }

  static async findProductByID(req, res) {
    const { id } = req.params;

    try {
      const product = await ProductService.findByID(id);

      res.json({
        message: `Get Detail ${id} Product Successfully`,
        product,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to get detail ${id} product!!`,
      });
    }
  }

  static async findProductByUser(req, res) {
    const { userId } = req.params;

    try {
      const product = await ProductService.findByUser(userId);

      res.json({
        message: `Get Detail User ${userId} Product Successfully`,
        product,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to get detail user ${userId} product!!`,
      });
    }
  }
}

export default ProductController;
