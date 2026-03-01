const handleResponse = (res, status, message, data = null, error = null) => {
  res.status(status).json({
    status,
    message,
    data,
    error,
  });
};

module.exports = handleResponse;
