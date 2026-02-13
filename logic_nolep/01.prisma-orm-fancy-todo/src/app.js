import express from "express";
import routes from "./routes/index.js";

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use("/api", routes)

export default app;