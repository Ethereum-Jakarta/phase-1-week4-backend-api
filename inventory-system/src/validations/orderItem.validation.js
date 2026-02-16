const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrderItem = {
  body: Joi.object().keys({
    quantity: Joi.number().integer().required(),
    orderId: Joi.required().custom(objectId),
    productId: Joi.required().custom(objectId),
  }),
};

const getAllOrderItems = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
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
  body: Joi.object()
    .keys({
      quantity: Joi.number().integer().required(),
      orderId: Joi.required().custom(objectId),
      productId: Joi.required().custom(objectId),
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
  getAllOrderItems,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
