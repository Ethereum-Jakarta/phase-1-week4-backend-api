import express from "express";
import { errorMiddleware } from "../middlewares/error.middleware";
import { apiRouter } from "../routes/api.route";
import "dotenv/config";

export const web = express();

web.use(express.json());
web.get("/", (req, res) => {
  res.send("hello");
});
web.use(apiRouter);
web.use(errorMiddleware);
