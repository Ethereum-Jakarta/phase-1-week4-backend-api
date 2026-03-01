const prisma = require('../../prisma/client');

const getOrders = async () => {
  const orders = await prisma.order.findMany();

  return orders;
};

const getOrder = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  return order;
};

const createOrder = async ({ totalPrice, customerName, customerEmail, userId }) => {
  const order = await prisma.order.create({
    data: { totalPrice, customerName, customerEmail, userId },
  });

  return order;
};

const updateOrder = async (orderId, { totalPrice, customerName, customerEmail, userId }) => {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { totalPrice, customerName, customerEmail, userId },
  });

  return order;
};

const deleteOrder = async (orderId) => {
  await prisma.orderItem.deleteMany({ where: { orderId } });
  const order = await prisma.order.delete({
    where: { id: orderId },
  });

  return order;
};

const getOrdersByUserId = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
  });

  return orders;
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
};
