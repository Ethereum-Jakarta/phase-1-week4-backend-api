const prisma = require('../../prisma');

const getAllProducts = async (category, skip = 0, limit = 10) => {
  const result = await prisma.product.findMany({
    where: {
      category: {
        name: {
          equals: category,
        },
      },
    },
    take: parseInt(limit),
    skip: parseInt(skip),
  });

  const resultCount = await prisma.product.count({
    where: {
      category: {
        name: {
          equals: category,
        },
      },
    },
    skip: parseInt(skip),
  });
  const totalPage = Math.ceil(resultCount / limit);

  return { totalPage, totalData: resultCount, data: result };
};

const getProduct = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  return product;
};

const deleteProduct = async (productId) => {
  const deleteProductData = await prisma.product.delete({
    where: { id: productId },
  });

  return deleteProductData;
};

const updateProduct = async (productId, productBody) => {
  const product = await prisma.product.update({
    where: { id: productId },
    data: productBody,
  });

  return product;
};

const createProduct = async (productBody) => {
  const newProduct = await prisma.product.create({
    data: productBody,
  });

  return newProduct;
};

module.exports = {
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  createProduct,
};
