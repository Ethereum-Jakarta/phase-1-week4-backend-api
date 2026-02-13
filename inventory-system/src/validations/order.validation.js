const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    date: Joi.date().required(),
    totalPrice: Joi.number().required(),
    customerName: Joi.string().required(),
    customerEmail: Joi.string().required(),
    userId: Joi.string().custom(objectId),
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
      date: Joi.date().required(),
      totalPrice: Joi.number().required(),
      customerName: Joi.string().required(),
      customerEmail: Joi.string().required(),
      userId: Joi.string().custom(objectId),
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
  getOrder,
  updateOrder,
  deleteOrder,
};
