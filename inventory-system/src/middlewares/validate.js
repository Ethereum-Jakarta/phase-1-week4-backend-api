const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']); // Tidak semua request user dari body saja, bisa juga dari params (/:id)
  const object = pick(req, Object.keys(validSchema)); // Pemilihan properti
  const { value, error } = Joi.compile(validSchema) // Bagian utama dari validasi
    .prefs({ errors: { label: 'key' }, abortEarly: false }) // Jika ada kesalahan akan dilanjutkan hingga mendapat semua kesalahan sekaligus
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value); // Nilai dari value akan disalin ke req
  return next();
};

module.exports = validate;
