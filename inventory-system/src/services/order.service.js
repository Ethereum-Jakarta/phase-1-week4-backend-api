const httpStatus = require('http-status');
const prisma = require('../../prisma/index');
const ApiError = require('../utils/ApiError');
const { deleteOrderItemById } = require('./orderItem.service');

/**
 * Create a order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
const createOrder = async (orderBody) => {
  return prisma.order.create({
    data: {
      ...orderBody,
      totalPrice: parseFloat(orderBody.totalPrice),
      date: new Date(orderBody.date).toISOString()},
  });
};

/**
 * Query for orders
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  const orders = await prisma.order.findMany();
  return orders;
};

/**
 * Get order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  return prisma.order.findFirst({
    include:{
      user:true
    },
    where: {
      id,
    },
  });
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
    data: {
      ...updateBody,
      date: new Date(updateBody.date).toISOString(),
      totalPrice: parseFloat(updateBody.totalPrice)
    },
  });

  return updateOrder;
};

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
const deleteOrderById = async (orderId) => {
  const orderItems = await prisma.orderItem.findMany({
    where: {
      orderId,
    },
  });
  // if (!orderItems || orderItems.length === 0) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Order items not found');
  // }

  for (const orderItem of orderItems) {
    await deleteOrderItemById(orderItem.id);
  }

  const deleteOrders = await prisma.order.deleteMany({
    where: {
      id: orderId,
    },
  });

  return deleteOrders;
};

const getAllOrder = async (skip = 0, take = 10) => {
  const orders = await prisma.order.findMany({
    include:{
      user:true
    },
    skip: parseInt(skip),
    take: parseInt(take),
  });
  return orders;
};

const getOrderCount = async () => {
  const count = await prisma.order.count();
  return count;
};

const getOrderByCustomerName = async (customerName) =>{
  return prisma.order.findMany({
    where: {
      customerName: {
        contains: customerName,
      },
    },
    include:{
      user:true,
    }
  });
}

module.exports = {
  createOrder,
  queryOrders,
  getOrderById,
  getAllOrder,
  updateOrderById,
  deleteOrderById,
  getOrderCount,
  getOrderByCustomerName
};
