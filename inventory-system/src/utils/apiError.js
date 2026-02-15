class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    // Menurunkan message dari constructor error
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Jika stack !== '' atau null 
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // jika tidak ada stack, maka stack akan diisi oleh error hasil captureStackTrace
    }
  }
}

module.exports = ApiError;
