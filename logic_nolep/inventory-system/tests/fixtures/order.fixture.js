const { v4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const prisma = require('../../prisma/client');
const { userOne } = require('./user.fixture');

const orderOne = {
  id: v4(),
  customerName: faker.person.fullName(),
  customerEmail: faker.internet.email(),
  userId: userOne.id,
  totalPrice: faker.number.float({ min: 10, max: 1000 }),
};

const insertOrder = async (order) => {
  await prisma.order.createMany({
    data: order,
    skipDuplicates: true,
  });
};

module.exports = {
  orderOne,
  insertOrder,
};
