const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const orderItemService = require('../service/orderItem.service');
const ApiError = require('../../utils/ApiError');
const { order } = require('../../prisma/client');

const getAllOrderItems = catchAsync(async(req, res) => {
    const orderItem = await orderItemService.getAllOrderItems()

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: "Get All OrderItem Success!",
        data: orderItem
    })
})

const getOrderItem = catchAsync(async(req, res) => {
    const orderItem = await orderItemService.getOrderItem(req.params.orderItemId)
    if(!orderItem) {
        throw new ApiError(httpStatus.NOT_FOUND, 'OrderItem Not Found!')
    }

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: "Get OrderItem Success!",
        data: orderItem
    })
})

const createOrderItem = catchAsync(async(req, res) => {
    const newOrderItem = await orderItemService.createOrderItem(req.body)

    res.status(httpStatus.CREATED).send({
        status: httpStatus.CREATED,
        message: "Create OrderItem Success!",
        data: newOrderItem
    })
})

const updateOrderItem = catchAsync(async(req, res) => {
    const orderItemId = req.params.orderItemId
    const orderItem = await orderItemService.updateOrderItemById(orderItemId, req.body)

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: "Update OrderItem Success!",
        data: orderItem
    })
})

const deleteOrderItem = catchAsync(async(req, res) => {
    const orderItemId = req.params.orderItemId
    const orderItem = await orderItemService.deleteOrderItem(orderItemId)

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        message: "Delete OrderItem Success!",
        data: orderItem
    })
})

module.exports = {getAllOrderItems, getOrderItem, createOrderItem, updateOrderItem, deleteOrderItem}