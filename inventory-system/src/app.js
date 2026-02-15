const express = require('express');
const httpStatus = require('http-status');
const router = require('./routes/v1');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/apiError');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const { jwtStrategy } = require('./config/passport');
const passport = require('passport');

const app = express();

// Morgan middleware
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// HTTP Header security
app.use(helmet());

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// Enable cors
app.use(cors());
app.options('*', cors());

// JWT auth
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.get('/', (req, res) => {
  res.send('Server is online');
});

// API (Application Programming Interfaces)
app.use('/v1', router);

// Send 404 jika route tidak ada
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});

// Convert error ke Instance API Error jika error tidak tertangkap
app.use(errorConverter);

// Handle error
app.use(errorHandler);

module.exports = app;
