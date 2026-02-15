const app = require("./app");
const prisma = require("../prisma/client");
const config = require('./config/config');
const logger = require('./config/logger');

let server;


prisma
  .$connect()
  .then(() => {
    logger.info("Connected to Database");
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((error) => {
    logger.error("Failed to connect to the database:", error);
    process.exit(1);
  });

const exitHandler = async () => {
  if (server) {
    await prisma.$disconnect();
    server.close(() => {
      logger.info("Server closed");
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

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
