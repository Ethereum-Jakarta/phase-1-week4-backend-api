const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/ApiError');
const orderService = require('./order.service');

/**
 * Get a Order Item by id
 * @param {ObjectId}orderItemId
 * @returns {Promise<OrderItem>}
 */
async function getOrderItemById(orderItemId) {
  return prisma.orderItem.findFirst({
    where: {
      id: orderItemId,
    },
  });
}

/**
 * Create a Order Item
 * @param {Object} orderItemBody
 * @returns {Promise<OrderItem>}
 */
async function createOrderItem(orderItemBody) {
  return prisma.orderItem.create({
    data: orderItemBody,
  });
}

/**
 * Get a Order Item
 * @param {object} options
 * @returns {Promise<OrderItem>}
 */
async function getOrderItem(options) {
  return prisma.orderItem.findMany({
    take: +options.take || 5,
    skip: +options.skip || 0,
  });
}

/**
 * Update a Order Item
 * @param {ObjectId} orderItemId
 * @param {Object} orderItemBody
 * @returns {Promise<OrderItem>}
 */
async function updateOrderItem(orderItemId, orderItemBody) {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order item not found');
  }
  const updatedOrderItem = await prisma.orderItem.update({
    where: {
      id: orderItemId,
    },
    data: orderItemBody,
  });
  return updatedOrderItem;
}

/**
 * Delete a Order Item
 * @param {ObjectId} orderItemId
 * @returns {Promise<OrderItem>}
 */
async function deleteOrderItem(orderItemId) {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order item not found');
  }
  const deletedOrderItem = await prisma.orderItem.deleteMany({
    where: {
      id: orderItemId,
    },
  });
  return deletedOrderItem;
}

/**
 * Get a Order Item by order id
 * @param {ObjectId} orderId
 * @returns {Promise<OrderItem>}
 */
async function getOrderItembyOrder(orderId) {
  const order = await orderService.getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const result = await prisma.orderItem.findMany({
    where: {
      orderId: orderId,
    },
  });
  return result;
}

module.exports = {
  getOrderItem,
  getOrderItemById,
  createOrderItem,
  deleteOrderItem,
  updateOrderItem,
  getOrderItembyOrder,
};
