const Joi = require('joi');

const orderItemValidationSchema = Joi.object({
  orderId: Joi.string().required().messages({
    'string.base': 'Order ID must be a string.',
    'any.required': 'Order ID is required.',
  }),
  productId: Joi.string().required().messages({
    'string.base': 'Product ID must be a string.',
    'any.required': 'Product ID is required.',
  }),
  quantity: Joi.number().integer().positive().required().messages({
    'number.base': 'Quantity must be a number.',
    'number.integer': 'Quantity must be an integer.',
    'number.positive': 'Quantity must be greater than zero.',
    'any.required': 'Quantity is required.',
  }),
  unitPrice: Joi.number().positive().required().messages({
    'number.base': 'Unit price must be a number.',
    'number.positive': 'Unit price must be greater than zero.',
    'any.required': 'Unit price is required.',
  }),
});

module.exports = { orderItemValidationSchema };
