const { faker } = require('@faker-js/faker');
const { v4 } = require('uuid');
const prisma = require('../../prisma/index');
const { insertUsers } = require('./user.fixture');

const orderOne = {
  id: v4(),
  date: faker.date.recent(),
  totalPrice: 0,
};

const insertOrders = async (users, orders) => {
  await insertUsers([users]);

  const ordersMapped = orders.map((order) => {
    return {
      ...order,
      customerName: users.name,
      customerEmail: users.email,
      userId: users.id,
    };
  });

  await prisma.order.createMany({
    data: ordersMapped,
    skipDuplicates: true,
  });
};

module.exports = {
  orderOne,
  insertOrders,
};
