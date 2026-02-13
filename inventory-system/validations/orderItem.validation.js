const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrderItem = {
    body: Joi.object().keys({
        orderId: Joi.string().custom(objectId).required(),
        productId: Joi.string().custom(objectId).required(),
        quantity: Joi.number().required(),
        unitPrice: Joi.number().required(),
    }),
};

const getOrderItem = {
    params: Joi.object().keys({
        orderItemId: Joi.string().custom(objectId),
    }),
};

const updateOrderItem = {
    params: Joi.object().keys({
        orderItemId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            orderId: Joi.string().custom(objectId).required(),
            productId: Joi.string().custom(objectId).required(),
            quantity: Joi.number().required(),
            unitPrice: Joi.number().required(),
        })
        .min(1),
};

const deleteOrderItem = {
    params: Joi.object().keys({
        orderItemId: Joi.string().custom(objectId).required(),
    }),
};

module.exports = {
    createOrderItem,
    getOrderItem,
    updateOrderItem,
    deleteOrderItem,
};