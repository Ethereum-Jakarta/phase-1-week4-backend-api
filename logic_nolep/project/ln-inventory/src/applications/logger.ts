import winston from "winston";
import { config } from "@config/config";

const enumerateErrors = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, {
      stack: info.stack,
      ...info,
    });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.isDev ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    enumerateErrors(),
    config.isDev ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message, stack, details }) => {
      const detailString = details
        ? `\nDetails: ${JSON.stringify(details, null, 2)}`
        : "";

      if (stack) {
        return `[${timestamp}] ${level}: ${message}${detailString}\n${stack}`;
      }
      return `[${timestamp}] ${level}: ${message}${detailString}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

export { logger };
