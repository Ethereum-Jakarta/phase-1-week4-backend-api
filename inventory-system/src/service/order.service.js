const httpStatus = require('http-status');
const { prisma } = require('../../prisma');
const ApiError = require('../utils/ApiError');
// const userService = require('./user.service');

const createOrder = async (date, totalPrice, customerName, customerEmail, userId) => {
  return prisma.order.create({
    data: {
      date,
      totalPrice,
      customerName,
      customerEmail,
      userId,
    },
  });
};

const getAllOrders = async (pageSize, skip) => {
  const orders = await prisma.order.findMany({
    skip,
    take: pageSize,
  });
  return orders;
};

const getOrderById = async (id) => {
  return prisma.order.findFirst({
    where: { id },
  });
};

const getOrderItemsByOrder = async (orderId) => {
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
  });

  return orderItems;
};

const updateOrderById = async (orderId, updateBody) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }

  const updateOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: updateBody,
  });

  return updateOrder;
};

const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }

  const deleteOrders = await prisma.order.deleteMany({
    where: {
      id: orderId,
    },
  });

  return deleteOrders;
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getOrderItemsByOrder,
};
