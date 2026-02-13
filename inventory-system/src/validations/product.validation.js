const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantityInStock: Joi.number().required(),
    categoryId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
    description: Joi.string().required(),
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
      price: Joi.number(),
      quantityInStock: Joi.number(),
      categoryId: Joi.string().custom(objectId),
      userId: Joi.string().custom(objectId),
      description: Joi.string(),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProduct,

  updateProduct,
  deleteProduct,
};
