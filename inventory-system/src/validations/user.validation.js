const Joi = require('joi');
const { objectId } = require('./custom.validation');


const getUserById = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
const getUserByEmail = {
  params: Joi.object().keys({
    email: Joi.string(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
