const Joi = require('joi');

const orderValidationSchema = Joi.object({
  totalPrice: Joi.number().positive().required().messages({
    'number.base': 'Total price must be a number.',
    'number.positive': 'Total price must be greater than zero.',
    'any.required': 'Total price is required.',
  }),
  customerName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Customer name must be a string.',
    'string.empty': 'Customer name cannot be empty.',
    'string.min': 'Customer name must have at least 3 characters.',
    'string.max': 'Customer name must not exceed 50 characters.',
    'any.required': 'Customer name is required.',
  }),
  customerEmail: Joi.string().email().required().messages({
    'string.email': 'Customer email must be a valid email.',
    'any.required': 'Customer email is required.',
  }),
  userId: Joi.string().required().messages({
    'string.base': 'User ID must be a string.',
    'any.required': 'User ID is required.',
  }),
});

module.exports = { orderValidationSchema };
