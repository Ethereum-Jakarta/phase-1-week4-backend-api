const Joi = require('joi');

const productValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Product name must be a string.',
    'string.empty': 'Product name cannot be empty.',
    'string.min': 'Product name must have at least 3 characters.',
    'string.max': 'Product name must not exceed 100 characters.',
    'any.required': 'Product name is required.',
  }),

  description: Joi.string().min(10).max(500).required().messages({
    'string.base': 'Description must be a string.',
    'string.empty': 'Description cannot be empty.',
    'string.min': 'Description must have at least 10 characters.',
    'string.max': 'Description must not exceed 500 characters.',
    'any.required': 'Description is required.',
  }),

  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number.',
    'number.positive': 'Price must be greater than zero.',
    'any.required': 'Price is required.',
  }),

  quantityInStock: Joi.number().integer().min(0).required().messages({
    'number.base': 'Quantity in stock must be a number.',
    'number.integer': 'Quantity in stock must be an integer.',
    'number.min': 'Quantity in stock cannot be negative.',
    'any.required': 'Quantity in stock is required.',
  }),

  categoryId: Joi.string().required().messages({
    'string.base': 'Category ID must be a string.',
    'any.required': 'Category ID is required.',
  }),

  userId: Joi.string().required().messages({
    'string.base': 'User ID must be a string.',
    'any.required': 'User ID is required.',
  }),
});

module.exports = { productValidationSchema };
