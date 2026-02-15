const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    customerName: Joi.string().required(),
    customerEmail: Joi.string(),
    totalPrice: Joi.number().positive().required(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};
const getOrdersByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      customerName: Joi.string().optional(),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getOrder,
  getOrdersByUser,
  createOrder,
  updateOrder,
  deleteOrder,
};
