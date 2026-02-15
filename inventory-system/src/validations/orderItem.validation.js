const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
    productId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().positive().allow(0).required(),
  }),
};

const getAll = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(0),
    size: Joi.number().integer().min(1),
    orderId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
    quantity: Joi.number().positive().allow(0),
    unitPrice: Joi.number().precision(2).positive(),
    orderBy: Joi.string().valid('quantity:asc', 'quantity:desc', 'unitPrice:asc', 'unitPrice:desc'),
  }),
};

const getId = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId),
  }),
};

const update = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      orderId: Joi.string().custom(objectId),
      productId: Joi.string().custom(objectId),
      quantity: Joi.number().positive().allow(0),
      unitPrice: Joi.number().precision(2).positive(),
    })
    .min(1),
};

const deleted = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId),
  }),
};

module.exports = { create, getAll, getId, update, deleted };
