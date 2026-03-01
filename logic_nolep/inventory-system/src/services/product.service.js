const prisma = require('../../prisma/client');

const getProducts = async () => {
  const products = await prisma.product.findMany();

  return products;
};

const getProduct = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  return product;
};

const createProduct = async ({ name, description, price, quantityInStock, categoryId, userId }) => {
  const product = await prisma.product.create({
    data: { name, description, price, quantityInStock, categoryId, userId },
  });

  return product;
};

const updateProduct = async (productId, { name, description, price, quantityInStock, categoryId, userId }) => {
  const product = await prisma.product.update({
    where: { id: productId },
    data: { name, description, price, quantityInStock, categoryId, userId },
  });

  return product;
};

const deleteProduct = async (productId) => {
  const product = await prisma.product.delete({
    where: { id: productId },
  });

  return product;
};

const getProductsByUserId = async (userId) => {
  const products = await prisma.product.findMany({
    where: { userId },
  });

  return products;
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByUserId,
};
