import app from "@applications/web";
import { prisma } from "@applications/prisma";
import { config } from "@config/config";
import { logger } from "@applications/logger";
import { Server } from "http";

let server: Server | null = null;

if (prisma) {
  logger.info("Prisma client is initialized.");
  if (config.isProd) {
    logger.info("🚀 Berjalan di mode PRODUCTION");
  } else {
    logger.info("🛠️ Berjalan di mode DEVELOPMENT");
  }
  server = app.listen(config.port, () => {
    logger.info(`Server is running on http://localhost:${config.port}`);
  });
}

const exitHandler = async () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed.");
    });
  }
  if (prisma) {
    await prisma.$disconnect();
    logger.info("Prisma client disconnected.");
  }
  process.exit(0);
};

const unexpectedErrorHandler = async (error: Error) => {
  console.error("Unexpected error:", error);
  await exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", exitHandler);
process.on("SIGINT", exitHandler);
