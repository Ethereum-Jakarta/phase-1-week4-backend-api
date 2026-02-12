const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    quantityInStock: Joi.number().required(),
    categoryId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    quantityInStock: Joi.number().required(),
    categoryId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
};
