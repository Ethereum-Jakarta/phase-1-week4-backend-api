const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { isNumber } = require('./custom.validation');

const createOrderItem = {
  body: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
    quantity: Joi.string().custom(isNumber),
    unitPrice: Joi.string().custom(isNumber),
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
  body: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
    productId: Joi.string().custom(objectId),
    quantity: Joi.string().custom(isNumber),
    unitPrice: Joi.string().custom(isNumber),
  })
    .min(1),
};

const deleteOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOrderItem,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem,
};