const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrderItem = {
  body: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
    productId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().integer().positive().required(),
    unitPrice: Joi.number().positive().required(),
  }),
};

const getOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId),
  }),
};

const updateOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
    quantity: Joi.number().integer().positive(),
    unitPrice: Joi.number().positive(),
  }),
};

const deleteOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId),
  }),
};

const getOrderItemByOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getOrderItem,
  getOrderItemByOrder,
  updateOrderItem,
  deleteOrderItem,
  createOrderItem,
};
