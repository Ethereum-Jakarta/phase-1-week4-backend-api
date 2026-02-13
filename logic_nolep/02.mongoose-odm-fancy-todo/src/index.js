import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv"

let server;
const port = 3000;
dotenv.config();

//koneksi ke mongodb
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Connected to MongoDB");
        server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    })

const shutdown = async () => {
    console.log('Shutting down...');
    if(server) {
        server.close()
    }
    await mongoose.connection.close();
    process.exit(0) //program end karna aman
}

//event yang memanggil untuk shutdown
process.on("uncaughtException", err => {
  console.error(err);
  shutdown("uncaughtException");
});// bug fatal, error sinkron, tidak tertangkap try/catch

process.on("unhandledRejection", err => {
  console.error(err);
  shutdown("unhandledRejection");
});//promise error, tidak ada catch()

process.on("SIGTERM", () => shutdown("SIGTERM"));//system stop => server dimatikan os, docker stop, pm2restart, kubernetes scaledown
process.on("SIGINT", () => shutdown("SIGINT"));// user stop => developer tekan ctrl + c atau shutdown manual