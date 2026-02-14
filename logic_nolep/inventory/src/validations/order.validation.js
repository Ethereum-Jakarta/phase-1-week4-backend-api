const Joi = require('joi');

const createOrder = {
    body: Joi.object().keys({
        total: Joi.number().positive().required(),
        userId: Joi.number().integer().positive().required(),
        orderItems: Joi.array().items(Joi.object({
            quantity: Joi.number().integer().positive().required(),
            price: Joi.number().positive().required(),
            productId: Joi.number().integer().positive().required(),
        })).required(),
    }),
};

const getOrder = {
    params: Joi.object().keys({
        orderId: Joi.number().integer().positive().required(),
    }),
};

const updateOrder = {
    params: Joi.object().keys({
        orderId: Joi.number().integer().positive().required(),
    }),
    body: Joi.object()
        .keys({
            total: Joi.number().positive(),
            userId: Joi.number().integer().positive(),
            orderItems: Joi.array().items(Joi.object({
                quantity: Joi.number().integer().positive(),
                price: Joi.number().positive(),
                productId: Joi.number().integer().positive(),
            })),
        })
        .min(1),
};

const deleteOrder = {
    params: Joi.object().keys({
        orderId: Joi.number().integer().positive().required(),
    }),
};

module.exports = { createOrder, getOrder, updateOrder, deleteOrder };

