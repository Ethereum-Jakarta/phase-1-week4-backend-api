const Joi = require('joi');
const { password } = require('./custom.validation');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    role: Joi.string().required(),
  }),
};

const getAll = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(0),
    size: Joi.number().integer().min(1),
    name: Joi.string(),
    role: Joi.string(),
    orderBy: Joi.string().valid('name:asc', 'name:desc', 'role:asc', 'role:desc'),
  }),
};

const getId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const update = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      role: Joi.string(),
    })
    .min(1),
};

const deleted = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getProducts = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    page: Joi.number().integer().min(0),
    size: Joi.number().integer().min(1),
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().precision(2).positive(),
    quantityInStock: Joi.number(),
    categoryId: Joi.string().custom(objectId),
    orderBy: Joi.string().valid(
      'name:asc',
      'name:desc',
      'description:asc',
      'description:desc',
      'price:asc',
      'price:desc',
      'quantityInStock:asc',
      'quantityInStock:desc'
    ),
  }),
};

const getOrders = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    page: Joi.number().integer().min(0),
    size: Joi.number().integer().min(1),
    date: Joi.date(),
    totalPrice: Joi.number().precision(2).positive(),
    customerName: Joi.string(),
    customerEmail: Joi.string().email(),
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

module.exports = { create, getAll, getId, update, deleted, getProducts, getOrders };
