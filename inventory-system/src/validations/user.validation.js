const Joi = require('joi');
const { objectId, password } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getProductsByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getOrdersByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getProductsByUser,
  getOrdersByUser
};
