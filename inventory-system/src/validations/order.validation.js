const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    date: Joi.date().required(),
    totalPrice: Joi.number().precision(2).positive().allow(0),
    customerName: Joi.string().required(),
    customerEmail: Joi.string().email().required(),
    userId: Joi.string().custom(objectId).required(),
  }),
};

const getAll = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(0),
    size: Joi.number().integer().min(1),
    date: Joi.date(),
    totalPrice: Joi.number().precision(2).positive(),
    customerName: Joi.string(),
    customerEmail: Joi.string().email(),
    userId: Joi.string().custom(objectId),
    orderBy: Joi.string().valid(
      'date:asc',
      'date:desc',
      'totalPrice:asc',
      'totalPrice:desc',
      'customerName:asc',
      'customerName:desc',
      'customerEmail:asc',
      'customerEmail:desc'
    ),
  }),
};

const getId = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const update = {
  params: Joi.object().keys({ orderId: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      date: Joi.date(),
      totalPrice: Joi.number().precision(2).positive(),
      customerName: Joi.string(),
      customerEmail: Joi.string().email(),
      userId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleted = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};


module.exports = { create, getAll, getId, update, deleted };
