const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().precision(2).positive().required(),
    quantityInStock: Joi.number().required(),
    categoryId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required(),
  }),
};

const getAll = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(0),
    size: Joi.number().integer().min(1),
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().precision(2).positive(),
    quantityInStock: Joi.number(),
    categoryId: Joi.string().custom(objectId),
    userId: Joi.string().custom(objectId),
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

const getId = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const update = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number().precision(2).positive(),
      quantityInStock: Joi.number(),
      categoryId: Joi.string().custom(objectId),
      userId: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleted = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const getProductByCategory = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(0),
    size: Joi.number().integer().min(1),
    category: Joi.string(),
    orderBy: Joi.string().valid('category:asc', 'category:desc'),
  }),
};

module.exports = { create, getAll, getId, update, deleted, getProductByCategory };
