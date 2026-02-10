const httpStatus = require('http-status');
const prisma = require('../../prisma');
const ApiError = require('../utils/apiError');

const createOrder = async (orderBody) => {
  const result = await prisma.order.create({
    data: orderBody,
  });
  return result;
};

const getProduct = async (where, option) => {
  const result = await prisma.order.findMany({
    where,
    ...option,
  });
  return result;
};

const getOrderById = async (orderId) => {
  const result = await prisma.order.findFirst({
    where: { id: orderId },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found');
  }

  return result;
};

const updateOrder = async (orderId, orderBody) => {
  const target = await getOrderById(orderId);
  const result = await prisma.order.update({
    where: { id: orderId },
    data: orderBody,
  });
  return result;
};

const deleteOrder = async (orderId) => {
  const target = await getOrderById(orderId);
  const result = await prisma.order.delete({
    where: { id: orderId },
  });
  return result;
};

module.exports = {
  createOrder,
  getProduct,
  getOrderById,
  updateOrder,
  deleteOrder,
};
