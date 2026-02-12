const httpStatus = require('http-status');
const prisma = require('../../prisma/client')
const ApiError = require('../utils/ApiError');

/**
 * Create a order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
const createOrder = async (orderBody,userId) => {
  orderBody.userId=userId;
  orderBody.totalPrice=0;
  // console.log(orderBody);
  return prisma.order.create({
    data: orderBody
  });
};

/**
 * Query for orders
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (skip,take) => {
  const orders = await prisma.order.findMany({
    skip: skip,
    take: take,
    include: {
      user: true, 

    },
  });

  return orders;
};
/**
 * Query for orders by user ID
 * @param {string} userId - The ID of the user
 * @returns {Promise<QueryResult>}
 */
const queryOrdersByUserId = async (userId,skip,take) => {
  const orders = await prisma.order.findMany({
    skip: skip,
    take: take,
    where: {
      userId: userId,
    },

  });
  return orders;
};

/**
 * Get order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  return prisma.order.findFirst({
    where: {
      id: id
    },
    include: {
      user: true, 
    },
  })
};

/**
 * Update order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  const updateOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: updateBody
  })

  return updateOrder;
};
/**
 * Update total price order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateTotalPrice = async (orderId, totalPrice) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  order.totalPrice +=totalPrice;
  const updateOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {totalPrice:order.totalPrice}
  })

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
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  const deleteOrders = await prisma.order.deleteMany({
    where: {
      id: orderId
    },
  })

  return deleteOrders;
};

module.exports = {
  createOrder,
  queryOrders,
  queryOrdersByUserId,
  getOrderById,
  updateOrderById,
  updateTotalPrice,
  deleteOrderById,
};