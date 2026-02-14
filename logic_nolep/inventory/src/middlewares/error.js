const { status } = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { Prisma } = require('@prisma/client');

const handlePrismaError = (err) => {
    switch (err.code) {
        case 'P2002':
            return new ApiError(status.BAD_REQUEST, 'Duplicate field value');
        default:
            return new ApiError(status.INTERNAL_SERVER_ERROR, 'An unknown error occurred');
    }
};

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || status.INTERNAL_SERVER_ERROR;
        const message = error.message || status[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        error = handlePrismaError(error);
    }
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        message = 'Internal Server Error';
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

module.exports = {
    errorConverter,
    errorHandler,
};
