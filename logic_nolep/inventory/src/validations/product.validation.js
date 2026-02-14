const Joi = require('joi');

const createProduct = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().positive().required(),
        stock: Joi.number().integer().positive().required(),
        categoryId: Joi.number().integer().positive().required(), 
    }),
};

const getProduct = {
    params: Joi.object().keys({
        productId: Joi.number().integer().positive().required(),
    }),
};

const updateProduct = {
    params: Joi.object().keys({
        productId: Joi.number().integer().positive().required(),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            description: Joi.string(),
            price: Joi.number().positive(),
            stock: Joi.number().integer().positive(),
            categoryId: Joi.number().integer().positive(),
        })
        .min(1),
};

const deleteProduct = {
    params: Joi.object().keys({
        productId: Joi.number().integer().positive().required(),
    }),
};

module.exports = { createProduct, getProduct, updateProduct, deleteProduct };

