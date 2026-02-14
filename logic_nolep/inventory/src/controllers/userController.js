const prisma = require('../config/db');

const getAllUsers = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const skip = (page - 1) * size;
    const take = parseInt(size);

    const users = await prisma.user.findMany({
        skip,
        take,
    });

    res.json(users);
};

const getUserById = async (req, res) => {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    res.json(user);
};

const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { name, email, role } = req.body;
    const user = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { name, email, role },
    });
    res.json(user);
};

const deleteUser = async (req, res) => {
    const { userId } = req.params;
    await prisma.user.delete({ where: { id: parseInt(userId) } });
    res.json({ message: 'User deleted successfully' });
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
