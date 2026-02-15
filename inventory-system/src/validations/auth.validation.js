const Joi = require('joi');
const { password } = require('./custom.validation');
const { jwtToken } = require('./custom.validation');

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
};

const refresh = {
  body: Joi.object().keys({
    token: Joi.string().required().custom(jwtToken),
  }),
};
module.exports = { register, login, refresh };
