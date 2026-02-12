const prisma = require('../../prisma');

const getAllOrders = async (skip = 0, limit = 10) => {
  const result = await prisma.order.findMany({
    take: parseInt(limit),
    skip: parseInt(skip),
  });

  const resultCount = await prisma.order.count({ skip: parseInt(skip) });
  const totalPage = Math.ceil(resultCount / limit);

  return { totalPage, totalData: resultCount, data: result };
};

const getOrder = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  return order;
};

const deleteOrder = async (orderId) => {
  const deleteOrderData = await prisma.order.delete({
    where: { id: orderId },
  });

  return deleteOrderData;
};

const updateOrder = async (orderId, bodyOrder) => {
  const updateOrderData = await prisma.order.update({
    where: { id: orderId },
    data: bodyOrder,
  });

  return updateOrderData;
};

const createOrder = async (bodyOrder) => {
  const newOrderData = await prisma.order.create({
    data: bodyOrder,
  });

  return newOrderData;
};

const getOrderItemsByOrder = async (orderId) => {
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
  });

  return orderItems;
};

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderItemsByOrder
};
