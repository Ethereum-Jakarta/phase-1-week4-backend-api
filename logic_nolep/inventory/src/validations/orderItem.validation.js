const Joi = require('joi');

const createOrderItem = {
    body: Joi.object().keys({
        quantity: Joi.number().integer().positive().required(),
        price: Joi.number().positive().required(),
        productId: Joi.number().integer().positive().required(),
        orderId: Joi.number().integer().positive().required(),
    }),
};

const getOrderItem = {
    params: Joi.object().keys({
        orderItemId: Joi.number().integer().positive().required(),
    }),
};

const updateOrderItem = {
    params: Joi.object().keys({
        orderItemId: Joi.number().integer().positive().required(),
    }),
    body: Joi.object()
        .keys({
            quantity: Joi.number().integer().positive(),
            price: Joi.number().positive(),
            productId: Joi.number().integer().positive(),
            orderId: Joi.number().integer().positive(),
        })
        .min(1),
};

const deleteOrderItem = {
    params: Joi.object().keys({
        orderItemId: Joi.number().integer().positive().required(),
    }),
};

module.exports = { createOrderItem, getOrderItem, updateOrderItem, deleteOrderItem };

