const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { isNumber } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    customerName: Joi.string().required(),
    customerEmail: Joi.string().required().email(),
    date: Joi.date().iso().required(),
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
  body: Joi.object().keys({
    customerName: Joi.string().required(),
    customerEmail: Joi.string().required().email(),
    date: Joi.date().iso().required(),
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