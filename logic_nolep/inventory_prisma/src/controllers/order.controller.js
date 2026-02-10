const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const createOrder = catchAsync( async (req, res) => {
    const order = await orderService.createOrder(req.body)

    res.status(httpStatus.CREATED).send({
        status: httpStatus.CREATED,
        messsage: "Create Order Success",
        data: order
    });
});

const getOrder = catchAsync( async (req, res) => {

    const options = {
        take: parseInt(req.query.take) || 5,
        skip: parseInt(req.query.skip) || 0   
      };
    const result = await orderService.getOrder(options);

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: "Get Orders Success",
        data: result
    });
});

const getOrderById = catchAsync( async (req, res) => {
    const result = await orderService.getOrderById(req.params.orderId);
    if(!result){
        throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found');
    }

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: 'Get Order Success',
        data: result
    });
});

const updateOrder = catchAsync( async (req, res) => {
    const updatedOrder = await orderService.updateOrder(req.params.orderId, req.body)

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: 'Update Order Success',
        data: updatedOrder
    });
});

const deleteOrder = catchAsync( async (req, res) => {
    await orderService.deleteOrder(req.params.orderId);

    res.status(httpStatus.OK).send({
        status:httpStatus.OK,
        messsage: 'Delete Order Success',
        data: null
    });
});

const getOrderByUser = catchAsync( async (req, res) => {
    const userOrder = await orderService.getOrderbyUser(req.params.userId);
    if(!userOrder){
        throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found');
    }

    res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        messsage: 'Get Order Success',
        data: userOrder
    });
});

module.exports = {
    createOrder,
    getOrder,
    getOrderById,
    getOrderByUser,
    deleteOrder,
    updateOrder,
};