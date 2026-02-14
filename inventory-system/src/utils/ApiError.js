class ApiError extends Error {
  constructor(statusCode, messsage, isOperational = true, stack = '') {
    super(messsage);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
