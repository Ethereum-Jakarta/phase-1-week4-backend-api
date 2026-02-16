const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    totalPrice: Joi.number().required(),
    customerName: Joi.string().required(),
    customerEmail: Joi.string().required().email(),
    userId: Joi.required().custom(objectId),
  }),
};

const getAllOrders = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      totalPrice: Joi.number().required(),
      customerName: Joi.string().required(),
      customerEmail: Joi.string().required(),
      userId: Joi.required().custom(objectId),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
