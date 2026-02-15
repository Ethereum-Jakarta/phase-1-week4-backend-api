const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/apiError');
const { Prisma } = require('@prisma/client');

// Function yang memeriksa jenis kesalahan, mengubahnya sesuai dengan error yang ada, lalu mengirim kesalahan ke middleware selanjutnya
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    // if error from axios or http request
    if (error.response) {
      const message = err.response.data.message || err.response.data;
      const statusCode = error.response.status;

      logger.info('handleAxiosError');
      error = new ApiError(statusCode, message, false, err.stack);
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // Handling prisma error
      logger.info('handlePrismaError');
      error = handlePrismaError(err);
    } else {
      // Handling global error
      const statusCode = error.statusCode;
      const message = error.message || httpStatus[statusCode];
      error = new ApiError(statusCode, message, false, err.stack);
    }
  }
  next(error);
};

// Function yang memeriksa jenis error yang berasal dari prisma, lalu dikirimkan ke function errorConverter
const handlePrismaError = (err) => {
  switch (err.code) {
    case 'P2002':
      // Handling duplicate key errors
      return new ApiError(400, `Duplicate field value: ${err.meta.target}`, false, err.stack);
    case 'P2014':
      // Handling invalid id errors
      return new ApiError(400, `Invalid ID: ${err.meta.target}`, false, err.stack);
    case 'P2003':
      // Handling invalid data errors
      return new ApiError(400, `Invalid input data: ${err.meta.target}`, false, err.stack);
    default:
      // Handling all other errors
      return new ApiError(500, `Something went wrong: ${err.message}`, false, err.stack);
  }
};

// Function yang akan mengirim response kesalahan ke client
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = { errorConverter, errorHandler };
