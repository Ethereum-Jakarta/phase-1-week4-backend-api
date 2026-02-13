const prisma = require('../../prisma/client')

const getAllOrders = async() => {
    const order = await prisma.order.findMany()
    return order
}

const getOrder = async(orderId) => {
    const order = await prisma.order.findUnique({where : {id : orderId}})
    return order
}

const createOrder = async(orderBody) => {
    const newOrder = await prisma.order.create({data: orderBody})
    return newOrder
}

const updateOrder = async(orderId, orderBody) => {
    const updateOrder = await prisma.order.update(
        {where: {id : orderId}, 
        data: orderBody
    })
    return updateOrder
}

const deleteOrder = async(orderId) => {
    const deleteOrder = await prisma.order.delete(orderId)
    return deleteOrder
}

const getOrderItemsByOrder = async(orderId) => {
    const orderItems = await prisma.orderItem.findMany(orderId)
    return orderItems
}

module.exports = {getAllOrders, getOrder, createOrder, updateOrder, deleteOrder, getOrderItemsByOrder}