const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrderItem = {
  body: Joi.object().keys({
    quantity: Joi.number().positive().required(),
    unitPrice: Joi.number().positive(),
  }),
};

const getOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId),
  }),
};

const updateOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      quantity: Joi.number().optional(),
      unitPrice: Joi.number().optional(),
    })
    .min(1),
};

const deleteOrderItem = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId),
  }),
};

const getOrderItemsByOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

module.exports = { getOrderItemsByOrder, createOrderItem, updateOrderItem, deleteOrderItem, getOrderItem };
