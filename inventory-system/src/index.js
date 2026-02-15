const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const prisma = require('../prisma');

let server;
let port = config.port;

if (prisma) {
  logger.info('Connected to Database');
  server = app.listen(port, () => {
    logger.info(`Listening to port ${port}`);
  });
}

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});