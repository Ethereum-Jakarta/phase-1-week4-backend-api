const Joi = require('joi');

const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Name must be a string.',
    'string.empty': 'Name cannot be empty.',
    'string.min': 'Name must have at least 3 characters.',
    'string.max': 'Name must not exceed 100 characters.',
    'any.required': 'Name is required.',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),

  password: Joi.string().min(6).max(255).required().messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Password must have at least 6 characters.',
    'string.max': 'Password must not exceed 255 characters.',
    'any.required': 'Password is required.',
  }),

  role: Joi.string().valid('user', 'admin').required().messages({
    'string.base': 'Role must be a string.',
    'any.only': "Role must be either 'user' or 'admin'.",
    'any.required': 'Role is required.',
  }),
});

module.exports = { userValidationSchema };
