const { v4 } = require('uuid');
const faker = require('faker');
const prisma = require('../../prisma');
const { categoryOne } = require('./category.fixture');
const { userOne } = require('./user.fixture');

const orderOne = {
    id: v4(),
    date: faker.date.recent(),
    totalPrice: parseFloat(faker.commerce.price()),
    customerName: faker.name.findName(),
    customerEmail: faker.internet.email().toLowerCase(),
    userId:userOne.id
};

const orderTwo = {
    id: v4(),
    date: faker.date.recent(),
    totalPrice: parseFloat(faker.commerce.price()),
    customerName: faker.name.findName(),
    customerEmail: faker.internet.email().toLowerCase(),
    userId:userOne.id
};

const insertOrders = async (orders) => {
    orders = orders.map((order) => ({ ...order}));
    await prisma.order.createMany({
      data: orders,
      skipDuplicates: true,
    });
};

module.exports = {
    orderOne,
    orderTwo,
    insertOrders,
};