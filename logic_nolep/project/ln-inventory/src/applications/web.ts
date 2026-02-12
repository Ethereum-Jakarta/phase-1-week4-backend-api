import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
