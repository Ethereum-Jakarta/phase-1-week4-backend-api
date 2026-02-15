const Joi = require('joi');
const { objectId } = require('./custom.validation');


const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().positive().required(),
    quantityInStock: Joi.number().integer().positive().required()
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};
const getProductsByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      price: Joi.number().positive().optional(),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const getProductsByCategory = {
  query: Joi.object().keys({
    category: Joi.string().required(),
  }),
};



module.exports = {
 createProduct,
 getProduct,
 updateProduct,
 deleteProduct,
 getProductsByUser,
 getProductsByCategory
};
