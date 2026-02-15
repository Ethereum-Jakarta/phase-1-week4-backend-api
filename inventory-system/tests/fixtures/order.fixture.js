const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');

const orderOne = {
  id: v4(),
  date: faker.date.recent(),
  totalPrice: 0,
  customerName: faker.name.findName(),
  customerEmail: faker.internet.email().toLowerCase(),
};

const insertOrders = async (userId, orders) => {
  orders = orders.map((order) => ({ ...order, userId: userId }));
  await prisma.orders.createMany({
    data: orders,
    skipDuplicates: true,
  });
};

const deleteOrders = async () => {
  await prisma.orders.deleteMany({});
};

module.exports = {
  orderOne,
  insertOrders,
  deleteOrders,
};
