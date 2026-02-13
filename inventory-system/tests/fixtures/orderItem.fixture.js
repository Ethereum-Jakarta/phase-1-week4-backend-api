const { v4 } = require('uuid');
const faker = require('faker');
const prisma = require('../../prisma');
const { orderOne } = require('./order.fixture');
const { productOne } = require('./product.fixture');


const orderItemOne = {
    id: v4(),
    orderId: orderOne.id,
    productId: productOne.id,
    quantity: parseInt(faker.commerce.price()),
    unitPrice: parseFloat(faker.commerce.price()),
};

const orderItemTwo = {
    id: v4(),
    orderId: orderOne.id,
    productId: productOne.id,
    quantity: parseInt(faker.commerce.price()),
    unitPrice: parseFloat(faker.commerce.price()),
};

const insertOrderItems = async (orderItems) => {
    orderItems = orderItems.map((orderItem) => ({ ...orderItem}));
    await prisma.orderItem.createMany({
      data: orderItems,
      skipDuplicates: true,
    });
};

module.exports = {
    orderItemOne,
    orderItemTwo,
    insertOrderItems,
};