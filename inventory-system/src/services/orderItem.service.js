const httpStatus = require('http-status');
const prisma = require('../../prisma/client')
const ApiError = require('../utils/ApiError');

/**
 * Create a orderItem
 * @param {Object} orderItemBody
 * @returns {Promise<OrderItem>}
 */
const createOrderItem = async (orderItemBody,userId) => {

  // console.log(orderItemBody);
  return prisma.orderItem.create({
    data: orderItemBody
  });
};

/**
 * Query for orderItems
 * @returns {Promise<QueryResult>}
 */
const queryOrderItems = async (skip,take) => {

  const orderItems = await prisma.orderItem.findMany({
    skip: skip,
    take: take,
    include: {
      product: true, 
      order: true,
    },
  });

  return orderItems;
};
/**
 * Query for orderItems by user ID
 * @param {string} userId - The ID of the user
 * @returns {Promise<QueryResult>}
 */
const queryOrderItemsByUserId = async (userId,skip,take) => {
  const orderItems = await prisma.orderItem.findMany({
    skip: skip,
    take: take,
    where: {
      userId: userId,
    },

  });
  return orderItems;
};
const queryOrderItemsByOrderId = async (orderId,skip,take) => {
  const orderItems = await prisma.orderItem.findMany({
    skip: skip,
    take: take,
    where: {
      orderId: orderId,
    },

  });
  return orderItems;
};

/**
 * Get orderItem by id
 * @param {ObjectId} id
 * @returns {Promise<OrderItem>}
 */
const getOrderItemById = async (id) => {
  return prisma.orderItem.findFirst({
    where: {
      id: id
    },
    // include: {
    //   product: true, 
    //   product: true, 
    // },
  })
};

/**
 * Update orderItem by id
 * @param {ObjectId} orderItemId
 * @param {Object} updateBody
 * @returns {Promise<OrderItem>}
 */
const updateOrderItemById = async (orderItemId, updateBody) => {

  const updateOrderItem = await prisma.orderItem.update({
    where: {
      id: orderItemId,
    },
    data: updateBody
  })

  return updateOrderItem;
};

/**
 * Delete orderItem by id
 * @param {ObjectId} orderItemId
 * @returns {Promise<OrderItem>}
 */
const deleteOrderItemById = async (orderItemId) => {
  const orderItem = await getOrderItemById(orderItemId);
  if (!orderItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OrderItem not found');
  }

  const deleteOrderItems = await prisma.orderItem.deleteMany({
    where: {
      id: orderItemId
    },
  })

  return orderItem;
};

module.exports = {
  createOrderItem,
  queryOrderItems,
  queryOrderItemsByUserId,
  queryOrderItemsByOrderId,
  getOrderItemById,
  updateOrderItemById,
  deleteOrderItemById,
};