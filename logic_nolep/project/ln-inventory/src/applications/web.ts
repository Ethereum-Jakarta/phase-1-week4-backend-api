import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { logger } from "./logger";
import { publicRouter } from "@routes/public.route";
import { globalErrorHandler } from "@middlewares/error.middleware";
import { apiRouter } from "@routes/api.route";
import { config } from "@config/config";
import { xss } from "express-xss-sanitizer";
import compression from "compression";
import morgan from "@config/morgan";

const app = express();

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(compression());

if (config.env !== "test") {
  (app.use(morgan.successHandler), app.use(morgan.errorHandler));
}
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  logger.info("Root endpoint accessed.");
  res.send("Hello, World!");
});

app.use(publicRouter);
app.use(apiRouter);
app.use(globalErrorHandler);

export default app;
