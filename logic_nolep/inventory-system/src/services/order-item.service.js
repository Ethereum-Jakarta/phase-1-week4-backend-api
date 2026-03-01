const prisma = require('../../prisma/client');

const getOrderItems = async () => {
  const orderItems = await prisma.orderItem.findMany();

  return orderItems;
};

const getOrderItem = async (orderItemId) => {
  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
  });

  return orderItem;
};

const createOrderItem = async ({ orderId, productId, quantity, unitPrice }) => {
  const orderItem = await prisma.orderItem.create({
    data: { orderId, productId, quantity, unitPrice },
  });

  return orderItem;
};

const updateOrderItem = async (orderItemId, { orderId, productId, quantity, unitPrice }) => {
  const orderItem = await prisma.orderItem.update({
    where: { id: orderItemId },
    data: { orderId, productId, quantity, unitPrice },
  });

  return orderItem;
};

const deleteOrderItem = async (orderItemId) => {
  const orderItem = await prisma.orderItem.delete({
    where: { id: orderItemId },
  });

  return orderItem;
};

const getOrderItemsByOrderId = async (orderId) => {
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
  });

  return orderItems;
};

module.exports = {
  getOrderItems,
  getOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
  getOrderItemsByOrderId,
};
