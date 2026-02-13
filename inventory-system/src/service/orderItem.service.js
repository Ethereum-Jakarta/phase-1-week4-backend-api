const httpStatus = require('http-status')
const prisma = require('../../prisma/client')
const ApiError = require('../../utils/ApiError')
const productService = require('../service/product.service')
const orderService = require('../service/order.service')

const getAllOrderItems = async() => {
    const orderItem = await prisma.orderItem.findMany()
    return orderItem
}

const getOrderItem = async(orderItemId) => {
    const orderItem = await prisma.orderItem.findUnique(orderItemId)
    return orderItem
}

const createOrderItem = async(orderId, productId, quantity, unitPrice) => {
    const product = await productService.getProduct(productId)

    if(!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found!')
    }

    if(!product.quantityInStock < quantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient stock')
    }

    const order = await orderService.getOrder(orderId);
    order.totalPrice += unitPrice * quantity;
    await orderService.updateOrder(orderId, order);

    product.quantityInStock -= quantity;
    await productService.updateProduct(productId, product);

    return prisma.orderItem.create({
        orderId,
        productId,
        quantity,
        unitPrice
    })
}

const updateOrderItemById = async(orderItemId, updateBody) => {
    const orderItem = await prisma.orderItem.findUnique({
        where: {
            id: orderItemId
        }
    })

    const order = await prisma.order.findUnique({
        where: {
            id: updateBody.orderId,
        }
    })

    if(!orderItem) {
        throw new ApiError(httpStatus.NOT_FOUND, 'OrderItem Not Found!')
    }

    if(!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!')
    }

    if((updateBody.quantity - orderItem.quantity) > orderItem.product.quantityInStock) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Out of Stock!')
    }

    await prisma.product.update({
        where: {id: orderItem.productId},
        data: {
            quantityInStock: orderItem.product.quantityInStock - (updateBody.quantity - orderItem.quantity)
        }
    })

    const updateOrderItem = prisma.orderItem.update({
        where: {id: orderItemId},
        data: updateBody
    })

    return updateOrderItem
}


const deleteOrderItem = async(orderItemId) => {
    const orderItem = await getOrderItem(orderItemId)
    if (!orderItem) {
        throw new ApiError(httpStatus.NOT_FOUND, 'OrderItem not found')
    }

    const deleteorderitem = await prisma.orderItem.delete({
        where: {id: orderItemId}
    })

    return deleteorderitem
}

module.exports = {getAllOrderItems, getOrderItem, createOrderItem, updateOrderItemById, deleteOrderItem}