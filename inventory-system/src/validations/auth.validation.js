const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}

const logout = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
}

module.exports = {
  register,
  login,
  logout
};
