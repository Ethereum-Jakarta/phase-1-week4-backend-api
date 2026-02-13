const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        quantityInStock: Joi.number().required(),
        categoryId: Joi.string().custom(objectId).required(),
        userId: Joi.string().custom(objectId).required(),
    }),
};

const getProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(objectId),
    }),
};

const updateProduct = {
    params: Joi.object().keys({
        productId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            quantityInStock: Joi.number().required(),
            categoryId: Joi.string().custom(objectId).required(),
            userId: Joi.string().custom(objectId).required(),
        })
        .min(1),
};

const deleteProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(objectId).required(),
    }),
};

module.exports = {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
};