const httpStatus = require('http-status');
const prisma = require('../../prisma/client');
const ApiError = require('../utils/ApiError');

const getOrders = async (options, filter) => {
  const page = Number(options.skip) || 0;
  const size = Number(options.take) || 5;

  options = {
    skip: page,
    take: size,
    include: {
      orderItems: true,
    },
    contains: filter.contains,
  };

  const orders = await prisma.order.findMany(options);

  // await prisma.order.update({
  //   where: {
  //     id: orders.id
  //   },
  //   data: {
        
  //   }
  // })

  return orders;
};

const getOrderById = async (orderId) => {
  return prisma.order.findFirst({
    where: {
      id: orderId,
    },
  });
};

const updateOrder = async (orderId, updateBody) => {
  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: updateBody,
  });
};

const deleteOrder = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order || order.length == 0) throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');

  return prisma.order.deleteMany({
    where: {
      id: orderId,
    },
  });
};

const createOrder = async (orderBody) => {
  return prisma.order.create({
    data: orderBody,
  });
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
