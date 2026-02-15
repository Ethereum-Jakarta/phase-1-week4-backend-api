import express from "express";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./logger";
import { publicRouter } from "@routes/public.route";
import { globalErrorHandler } from "@middlewares/error.middleware";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  logger.info("Root endpoint accessed.");
  res.send("Hello, World!");
});

app.use(publicRouter);
app.use(globalErrorHandler);

export default app;
