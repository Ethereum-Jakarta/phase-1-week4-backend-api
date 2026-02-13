const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const orderService = require('../service/order.service');
const ApiError = require('../../utils/ApiError');
const { order } = require('../../prisma/client');

const getAllOrders = catchAsync(async(req, res) => {
    const order = await orderService.getAllOrders()
    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: 'Get All Data Orders Success!',
        data: order
    })
})

const getOrder = catchAsync(async(req, res) => {
    const order = await orderService.getOrder(req.params.id)
    if(!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!')
    }
    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: 'Get Order By Id Success!',
        data: order
    })
})

const createOrder = catchAsync(async(req,res) => {
    const orderBody = req.body
    const newOrder = await orderService.createOrder(orderBody)
    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: 'Create Order Success!',
        data: newOrder
    })
})

const updateOrder = catchAsync(async(req, res) => {
    const orderBody = req.body
    const orderId = req.params.id
    const updateorder = await orderService.updateOrder(orderId, orderBody)
    if(!updateorder) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!')
    }
    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: 'Update Order Success!',
        data: updateorder
    })
})

const deleteOrder = catchAsync(async(req, res) => {
    const deleteorder = await orderService.deleteOrder(req.params.id)
    if(!deleteorder) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!')
    }
    res.status(httpStatus.OK).send({
        status:  httpStatus.OK,
        message: 'Delete Order Success!',
        data: deleteorder
    })
})

const getOrderItemsByOrder = catchAsync(async(req, res) => {
    const orderId = req.params.id
    const data = await orderService.getOrderItemsByOrder(orderId)
    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message : 'Get Order Items By Order Success!',
        data
    })
})

module.exports = {getAllOrders, getOrder, createOrder, updateOrder, deleteOrder, getOrderItemsByOrder}