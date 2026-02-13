import rateLimit from 'express-rate-limit';
import ApiError from '../utils/ApiError.js';
import status from 'http-status';

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, next) => {
    next(new ApiError(status.TOO_MANY_REQUESTS, 'Too many requests, please try again later.'));
  },
});

export default rateLimiter;
