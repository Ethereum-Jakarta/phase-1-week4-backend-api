const Joi = require('joi');
const { objectId, password } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.required().custom(password),
    role: Joi.string().required(),
  }),
};

const getAllUsers = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
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
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      email: Joi.string().email(),
      password: Joi.required().custom(password),
      role: Joi.string().required(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
