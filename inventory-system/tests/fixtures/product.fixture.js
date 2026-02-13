const { v4 } = require('uuid');
const faker = require('faker');
const prisma = require('../../prisma');
const { categoryOne } = require('./category.fixture');
const { userOne } = require('./user.fixture');

const productOne = {
    id: v4(),
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    quantityInStock: 100,
    categoryId:categoryOne.id,
    userId:userOne.id
};

const productTwo = {
    id: v4(),
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    quantityInStock: 100,
    categoryId:categoryOne.id,
    userId:userOne.id
};

const insertProducts = async (products) => {
    products = products.map((product) => ({ ...product}));
    await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    });
};

module.exports = {
    productOne,
    productTwo,
    insertProducts,
};