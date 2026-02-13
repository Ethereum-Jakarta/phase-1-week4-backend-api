import OrderItemService from '../services/orderItem.service.js';
import logger from '../config/logger.js';

class OrderItemController {
  static async createOrderItem(req, res) {
    const { orderId, productId, quantity, unitPrice } = req.body;
    const parsedQuantity = Number(quantity);
    const parsedUnitprice = Number(unitPrice);

    try {
      const orderItem = await OrderItemService.create({
        orderId,
        productId,
        quantity: parsedQuantity,
        unitPrice: parsedUnitprice,
      });

      res.status(201).json({
        message: 'Order Item Created Successfully',
        orderItem,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to create order!!',
      });
    }
  }

  static async updateOrderItem(req, res) {
    const { id } = req.params;
    const { orderId, productId, quantity, unitPrice } = req.body;
    const parsedQuantity = Number(quantity);
    const parsedUnitprice = Number(unitPrice);

    try {
      const orderItem = await OrderItemService.update(id, {
        orderId,
        productId,
        quantity: parsedQuantity,
        unitPrice: parsedUnitprice,
      });

      res.json({
        message: 'Order Item Updated Successfully',
        orderItem,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to update order item!!',
      });
    }
  }

  static async hardDeleteOrderItem(req, res) {
    const { id } = req.params;

    try {
      const orderItem = await OrderItemService.hardDelete(id);

      res.json({
        message: `Delete Order Item ${id} Successfully`,
        orderItem,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to detele ${id} order item!!`,
      });
    }
  }

  static async softDeleteOrderItem(req, res) {
    const { id } = req.params;

    try {
      const orderItem = await OrderItemService.softDelete(id);

      res.json({
        message: `Soft Delete ${id} Order Item Successfully`,
        orderItem,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to soft delete ${id} order item!!`,
      });
    }
  }

  static async getAllOrderItems(req, res) {
    try {
      const orderItem = await OrderItemService.getAll();

      res.json({
        message: 'Get All Data Order Items Successfully',
        orderItem,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: 'Failed to get all data order items!!',
      });
    }
  }

  static async findOrderItemByID(req, res) {
    const { id } = req.params;

    try {
      const orderItem = await OrderItemService.findByID(id);

      res.json({
        message: `Get Detail ${id} Order Item Successfully`,
        orderItem,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to get detail ${id} order item!!`,
      });
    }
  }

  static async findOrderItemByOrder(req, res) {
    const { orderId } = req.params;

    try {
      const orderItem = await OrderItemService.findByOrder(orderId);

      res.json({
        message: `Get Detail Order ${orderId} Order Item Successfully`,
        orderItem,
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        message: `Failed to get detail order ${orderId} order item!!`,
      });
    }
  }
}

export default OrderItemController;
