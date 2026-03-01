const Joi = require('joi');

const categoryValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Name should be a type of text.',
    'string.empty': 'Name cannot be empty.',
    'string.min': 'Name should have a minimum length of 3.',
    'string.max': 'Name should have a maximum length of 50.',
    'any.required': 'Name is required.',
  }),
});

module.exports = { categoryValidationSchema };
