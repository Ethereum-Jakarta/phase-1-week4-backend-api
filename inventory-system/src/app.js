const express = require('express');
const httpStatus = require('http-status');
const helmet = require('helmet');
// const compression = require('compression');
const xss = require('xss-clean');
const cors = require('cors');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/apiError');
const router = require('./routes/v1');

const app = express();
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(xss());

// app.use(compression);
// ini kalo diaktifin gatau kenapa jadi error pas request data

app.use(cors());
app.options('*', cors());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/v1', router);

// app.use(router);
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});
app.use(errorConverter);
app.use(errorHandler);
module.exports = app;
