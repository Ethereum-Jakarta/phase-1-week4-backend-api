const prisma = require('../config/db');

const createCategory = async (req, res) => {
    const { name } = req.body;
    const category = await prisma.category.create({
        data: { name },
    });
    res.json(category);
};

const getAllCategories = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const skip = (page - 1) * size;
    const take = parseInt(size);

    const categories = await prisma.category.findMany({
        skip,
        take,
    });

    res.json(categories);
};

const getCategoryById = async (req, res) => {
    const { categoryId } = req.params;
    const category = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
    res.json(category);
};

const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;
    const category = await prisma.category.update({
        where: { id: parseInt(categoryId) },
        data: { name },
    });
    res.json(category);
};

const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;
    await prisma.category.delete({ where: { id: parseInt(categoryId) } });
    res.json({ message: 'Category deleted successfully' });
};

module.exports = { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };
