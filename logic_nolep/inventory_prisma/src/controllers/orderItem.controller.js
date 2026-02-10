const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderItemService } = require('../services');
const { orderItem } = require('../../prisma/client');

const createOrderItem = catchAsync( async (req, res) => {
    const orderItem = await orderItemService.createOrderItem(req.body)

    res.status(httpStatus.CREATED).send({
        status: httpStatus.CREATED,
        messsage: "Create Order Item Success",
        data: orderItem
    });
});

const getOrderItem = catchAsync( async (req, res) => {
    const options = {
        take: parseInt(req.query.take) || 5,
        skip: parseInt(req.query.skip) || 0   
      };
    const result = await orderItemService.getOrderItem(options);

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: "Get Order Items Success",
        data: result
    });
});

const getOrderItemById = catchAsync( async (req, res) => {
    const result = await orderItemService.getOrderItemById(req.params.orderItemId);
    if(!result){
        throw new ApiError(httpStatus.NOT_FOUND, 'Order Item Not Found');
    }

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: 'Get Order Item Success',
        data: result
    });
});

const updateOrderItem = catchAsync( async (req, res) => {
    const updatedOrder = await orderItemService.updateOrderItem(req.params.orderItemId, req.body)

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: 'Update Order Item Success',
        data: updatedOrder
    });
});

const deleteOrderItem = catchAsync( async (req, res) => {
    await orderItemService.deleteOrderItem(req.params.orderItemId);

    res.status(httpStatus.OK).send({
        status:httpStatus.OK,
        messsage: 'Delete Order Item Success',
        data: null
    });
});

const getOrderItemByOrder = catchAsync( async (req, res) => {
    const OrderItem = await orderItemService.getOrderItembyOrder(req.params.orderId);
    if(!OrderItem){
        throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found');
    }

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: 'Get Order Item Success',
        data: orderItem
    });
});

module.exports = {
    createOrderItem,
    getOrderItem,
    getOrderItemById,
    getOrderItemByOrder,
    updateOrderItem,
    deleteOrderItem
};