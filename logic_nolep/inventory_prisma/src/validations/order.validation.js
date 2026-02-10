const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    date: Joi.date(),
    totalPrice: Joi.number().positive().required(),
    customerName: Joi.string().required(),
    customerEmail: Joi.string().email().required(),
    userId: Joi.string().uuid().custom(objectId).required(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    date: Joi.date(),
    totalPrice: Joi.number().positive(),
    customerName: Joi.string(),
    customerEmail: Joi.string().email(),
    userId: Joi.string().uuid().custom(objectId),
  }),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const getOrderByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getOrder,
  getOrderByUser,
  deleteOrder,
  createOrder,
  updateOrder,
};
