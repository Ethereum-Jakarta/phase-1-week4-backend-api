import app from "./app.js";
import { prisma } from "../lib/prisma.js";

let server;
let port = 3000;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to Database");

        server = app.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    } catch (error) {
        console.error('Database connection failed', error)
        process.exit(1) //program end karna error
    }
}

const shutdown = async () => {
    console.log('Shutting down...');
    if(server) {
        server.close()
    }
    await prisma.$disconnect();
    process.exit(0) //program end karna aman
}

//event yang memanggil untuk shutdown
process.on("uncaughtException", shutdown); // bug fatal, error sinkron, tidak tertangkap try/catch
process.on("unhandledRejection", shutdown); //promise error, tidak ada catch()
process.on("SIGTERM", shutdown); //system stop => server dimatikan os, docker stop, pm2restart, kubernetes scaledown
process.on("SIGINT", shutdown); // user stop => developer tekan ctrl + c atau shutdown manual

startServer();