const { status } = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');

/**
 * Create a order
 * @param {Object} orderBody
 * @param {ObjectId} userId
 * @returns {Promise<Order>}
 */

const createOrder = async (orderBody) => {
  const { orderitems, ...orderData } = orderBody;

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: orderData,
    });

    const orderItemsWithOrderId = orderitems.map((item) => ({
      ...item,
      orderId: order.id,
    }));

    await tx.orderItem.createMany({
      data: orderItemsWithOrderId,
    });

    const orderWithItems = await tx.order.findUnique({
      where: { id: order.id },
      include: { orderitems: true },
    });

    return orderWithItems;
  });
};

/**
 * Get All Orders
 * @returns {Promise<orders>}
 */
const getAllOrders = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, // optional: urut dari yang terbaru
    }),
    prisma.order.count(),
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  return prisma.order.findFirst({
    where: {
      id: id,
    },
  });
};

/**
 * Update order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<updateOrder>}
 */
const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(status.NOT_FOUND, 'Order not found');
  }

  const updateOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: { ...updateBody },
  });

  return updateOrder;
};

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(status.NOT_FOUND, 'Order not found');
  }

  const deleteOrder = await prisma.order.delete({
    where: {
      id: orderId,
    },
  });

  return deleteOrder;
};

/**
 * Get Order By UserID
 * @param {ObjectId} userId
 * @returns {Promise<Order>}
 */
const getOrdersByUser = async (userId) => {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'User not found');
  }
  return await prisma.order.findMany({
    where: { userId },
    include: { orderitems: true },
  });
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById, getOrdersByUser };
