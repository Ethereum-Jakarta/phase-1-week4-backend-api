const prisma = require('../config/db');

const createProduct = async (req, res) => {
    const { name, description, price, stock, categoryId } = req.body;
    const product = await prisma.product.create({
        data: {
            name,
            description,
            price,
            stock,
            categoryId: parseInt(categoryId),
            userId: req.user.id,
        },
    });
    res.json(product);
};

const getAllProducts = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const skip = (page - 1) * size;
    const take = parseInt(size);

    const products = await prisma.product.findMany({
        skip,
        take,
    });

    res.json(products);
};

const getProductById = async (req, res) => {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    res.json(product);
};

const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, stock, categoryId } = req.body;
    const product = await prisma.product.update({
        where: { id: parseInt(productId) },
        data: { name, description, price, stock, categoryId: parseInt(categoryId) },
    });
    res.json(product);
};

const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    await prisma.product.delete({ where: { id: parseInt(productId) } });
    res.json({ message: 'Product deleted successfully' });
};

const searchProductByCategory = async (req, res) => {
    const { category } = req.query;
    const products = await prisma.product.findMany({
        where: {
            category: {
                name: { contains: category },
            },
        },
    });
    res.json(products);
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProductByCategory };
