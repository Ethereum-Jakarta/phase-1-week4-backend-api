import app from './app.js';
import { prisma } from '../lib/prisma.js';
import config from './config/config.js';
import logger from './config/logger.js';

let server;
let port = config.port;

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Connected to Database');

    server = app.listen(port, () => {
      logger.info(`Server listening on port http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Database connection failed', error);
    process.exit(1); //program end karena error
  }
};

const shutdown = async () => {
  logger.info('Shutting down...');
  if (server) {
    server.close();
  }
  await prisma.$disconnect();
  process.exit(0); //program end karna aman
};

//event yang memanggil untuk shutdown
process.on('uncaughtException', shutdown); // bug fatal, error sinkron, tidak tertangkap try/catch
process.on('unhandledRejection', shutdown); //promise error, tidak ada catch()
process.on('SIGTERM', shutdown); //system stop => server dimatikan os, docker stop, pm2restart, kubernetes scaledown
process.on('SIGINT', shutdown); // user stop => developer tekan ctrl + c atau shutdown manual

startServer();
