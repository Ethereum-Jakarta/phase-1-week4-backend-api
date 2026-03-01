const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const xss = require('xss-clean');
const passport = require('passport');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { errorConverter, errorHandler } = require('./middlewares/error.middleware');
const router = require('./routes');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Load Swagger YAML file
const swaggerDocument = yaml.load('./api.yaml');

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clean cross site scripting
app.use(xss());

// Cross Origin Resource Sharing
app.use(cors());
app.options('*', cors());

// Passport
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// API routes
app.use('/api', router);

app.use(errorConverter);
app.use(errorHandler);

// Export app module
module.exports = app;
