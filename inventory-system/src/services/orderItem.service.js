const { status } = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');
const { orderService } = require('./order.service');

/**
 * Create a order item
 * @param {Object} orderItemBody
 * @param {ObjectId} userId
 * @returns {Promise<orderItems>}
 */
const createOrderWithItems = async (userId, orderBody) => {
  const { orderItems, totalPrice, customerName, customerEmail } = orderBody;
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        totalPrice,
        customerName,
        customerEmail,
        date: new Date(),
      },
    });

    for (const item of orderItems) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new ApiError(status.NOT_FOUND, `Produk ID ${item.productId} tidak ditemukan`);
      }

      if (product.quantity < item.quantity) {
        throw new ApiError(status.BAD_REQUEST, `Stok tidak cukup untuk ${product.name}`);
      }

      // Kurangi stok
      await tx.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });

      // Buat OrderItem
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        },
      });
    }

    return order;
  });
};

/**
 * Get All Item Orders
 * @returns {Promise<orderItems>}
 */
const getAllOrderItems = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [orderItems, total] = await Promise.all([
    prisma.orderItem.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.orderItem.count(),
  ]);

  return {
    orderItems,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get order item by id
 * @param {ObjectId} id
 * @returns {Promise<OrderItem>}
 */
const getOrderItemById = async (id) => {
  return prisma.orderItem.findFirst({
    where: {
      id: id,
    },
  });
};

/**
 * Update order item by id
 * @param {ObjectId} orderItemId
 * @param {Object} updateBody
 * @returns {Promise<updateOrderItem>}
 */
const updateOrderItemById = async (orderItemId, updateBody) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(status.NOT_FOUND, 'Order Item not found');
  }

  const updateOrderItem = await prisma.orderItem.update({
    where: {
      id: orderItemId,
    },
    data: { ...updateBody },
  });

  return updateOrderItem;
};

/**
 * Delete order item by id
 * @param {ObjectId} orderItemId
 * @returns {Promise<OrderItem>}
 */
const deleteOrderItemById = async (orderItemId) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(status.NOT_FOUND, 'Order Item not found');
  }

  const deleteOrderItem = await prisma.orderItem.delete({
    where: {
      id: orderItemId,
    },
  });

  return deleteOrderItem;
};

/**
 * Get Order By orderID
 * @param {ObjectId} orderId
 * @returns {Promise<OrderItem>}
 */
const getOrderItemsByOrder = async (orderId) => {
  const order = await orderService.getOrderById(orderId);
  if (!order) {
    throw new ApiError(status.NOT_FOUND, 'Order not found');
  }
  return await prisma.orderItem.findMany({
    where: { orderId: parseInt(orderId) },
  });
};

module.exports = {
  createOrderWithItems,
  getAllOrderItems,
  getOrderItemById,
  updateOrderItemById,
  deleteOrderItemById,
  getOrderItemsByOrder,
};
