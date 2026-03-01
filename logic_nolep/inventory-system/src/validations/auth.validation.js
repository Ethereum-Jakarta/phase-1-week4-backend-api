const Joi = require('joi');

const authValidationSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().optional(),
});

module.exports = { authValidationSchema };
