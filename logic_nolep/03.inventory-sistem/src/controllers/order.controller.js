import OrderService from '../services/order.service.js';
import logger from '../config/logger.js';

class OrderController {
  static async createOrder(req, res) {
    const { totalPrice, customerName, customerEmail, userId } = req.body;
    const parsedTotalPrice = Number(totalPrice);

    try {
      const order = await OrderService.create({ totalPrice: parsedTotalPrice, customerName, customerEmail, userId });

      res.status(201).json({
        message: 'Order Create Successfully',
        order,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to create order!!',
      });
    }
  }

  static async updateOrder(req, res) {
    const { id } = req.params;
    const { totalPrice, customerName, customerEmail, userId } = req.body;
    const parsedTotalPrice = Number(totalPrice);

    try {
      const order = await OrderService.update(id, { totalPrice: parsedTotalPrice, customerName, customerEmail, userId });

      res.json({
        message: 'Order Updated Successfully',
        order,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to update order!!',
      });
    }
  }

  static async hardDeleteOrder(req, res) {
    const { id } = req.params;

    try {
      const order = await OrderService.hardDelete(id);

      res.json({
        message: `Delete Order ${id} Successfully`,
        order,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to detele ${id} order!!`,
      });
    }
  }

  static async softDeleteOrder(req, res) {
    const { id } = req.params;

    try {
      const order = await OrderService.softDelete(id);

      res.json({
        message: `Soft Delete ${id} Order Successfully`,
        order,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to soft delete ${id} order!!`,
      });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const order = await OrderService.getAll();

      res.json({
        message: 'Get All Data Orders Successfully',
        order,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to get all data orders!!',
      });
    }
  }

  static async findOrderByID(req, res) {
    const { id } = req.params;

    try {
      const order = await OrderService.findByID(id);

      res.json({
        message: `Get Detail ${id} Order Successfully`,
        order,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to get detail ${id} order!!`,
      });
    }
  }

  static async findOrderByUser(req, res) {
    const { userId } = req.params;

    try {
      const order = await OrderService.findByUser(userId);

      res.json({
        message: `Get Detail User ${userId} Order Successfully`,
        order,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to get detail user ${userId} order!!`,
      });
    }
  }
}

export default OrderController;
