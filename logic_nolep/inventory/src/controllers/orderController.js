const prisma = require('../config/db');

const createOrder = async (req, res) => {
    try {
        const { total, userId, orderItems } = req.body;

       
        for (let item of orderItems) {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(item.productId) },
            });

            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for product ID ${item.productId}.` });
            }
        }

      
        const order = await prisma.order.create({
            data: {
                total,
                userId: parseInt(userId),
                orderItems: {
                    create: orderItems.map(item => ({
                        quantity: item.quantity,
                        price: item.price,
                        productId: parseInt(item.productId),
                    })),
                },
            },
            include: {
                orderItems: true,
            },
        });

        for (let item of orderItems) {
            await prisma.product.update({
                where: { id: parseInt(item.productId) },
                data: { stock: { decrement: item.quantity } },
            });
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;
        const skip = (page - 1) * parseInt(size);
        const take = parseInt(size);

        const orders = await prisma.order.findMany({
            skip,
            take,
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        const { total, userId } = req.body;

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { total, userId: parseInt(userId) },
        });

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);
        if (isNaN(orderId)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        await prisma.order.delete({ where: { id: orderId } });

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder };

