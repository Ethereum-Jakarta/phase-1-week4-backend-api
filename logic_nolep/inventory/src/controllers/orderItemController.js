const prisma = require('../config/db');

const createOrderItem = async (req, res) => {
    const { quantity, price, productId, orderId } = req.body;
    const orderItem = await prisma.orderItem.create({
        data: {
            quantity,
            price,
            productId: parseInt(productId),
            orderId: parseInt(orderId),
        },
    });
    res.json(orderItem);
};

const getAllOrderItems = async (req, res) => {
    const { page = 1, size = 10 } = req.query;
    const skip = (page - 1) * size;
    const take = parseInt(size);

    const orderItems = await prisma.orderItem.findMany({
        skip,
        take,
    });

    res.json(orderItems);
};

const getOrderItemById = async (req, res) => {
    const { orderItemId } = req.params;
    const orderItem = await prisma.orderItem.findUnique({ where: { id: parseInt(orderItemId) } });
    res.json(orderItem);
};

const updateOrderItem = async (req, res) => {
    const { orderItemId } = req.params;
    const { quantity, price, productId, orderId } = req.body;
    const orderItem = await prisma.orderItem.update({
        where: { id: parseInt(orderItemId) },
        data: { quantity, price, productId: parseInt(productId), orderId: parseInt(orderId) },
    });
    res.json(orderItem);
};

const deleteOrderItem = async (req, res) => {
    const { orderItemId } = req.params;
    await prisma.orderItem.delete({ where: { id: parseInt(orderItemId) } });
    res.json({ message: 'Order item deleted successfully' });
};

module.exports = { createOrderItem, getAllOrderItems, getOrderItemById, updateOrderItem, deleteOrderItem };
