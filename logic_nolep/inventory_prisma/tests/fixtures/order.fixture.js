const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');
const { userOne, userTwo } = require('./user.fixture');

const orderOne = {
  id: v4(),
  date: faker.date.recent(),
  totalPrice: faker.datatype.float({ min: 10, max: 500, precision: 0.1 }),
  customerName: faker.name.findName(),
  customerEmail: faker.internet.email(),
  userId: userOne.id,
};

const orderTwo = {
  id: v4(),
  date: faker.date.recent(),
  totalPrice: faker.datatype.float({ min: 10, max: 500, precision: 0.1 }),
  customerName: faker.name.findName(),
  customerEmail: faker.internet.email(),
  userId: userTwo.id,
};

async function insertOrders(orders) {
  orders = orders.map((order) => ({ ...order }));
  await prisma.order.createMany({
    data: orders,
  });
}

module.exports = { orderOne, orderTwo, insertOrders };
