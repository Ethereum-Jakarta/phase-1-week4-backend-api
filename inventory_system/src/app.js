const express = require('express');
const httpStatus = require('http-status');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/config');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const router = require('./routes/v1');
// const swaggerJsDoc = require('swagger-jsdoc');
const json = require('../swagger.json');
const swaggerUI = require(`swagger-ui-express`);
const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// perlindungan terhadap http header
app.use(helmet());

// aktifin parsing json
app.use(express.json());

// aktifin urlencoded
app.use(express.urlencoded({ extended: true }));

// membersihkan kode dari xss
app.use(xss());

// mengkompress data yang masuk ke server
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// const swaggerDocs = swaggerJsDoc(json);
app.use('/v1/docs', swaggerUI.serve, swaggerUI.setup(json))

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/v1', router);

// kirim code 404 jika route tidak ada
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});

// convert error jadi Instance API Error jika ada error yang tidak ketangkap
app.use(errorConverter);

// handler error
app.use(errorHandler);

module.exports = app;
