const app = require('./app');
const prisma = require('../prisma/client');

let server;
let port = 3000

if (prisma) {
    console.log('Connected to Database');
    server = app.listen(port, () => {
        console.log(`Listening to port ${port}`);
    });
}

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log('Server closed');
        });
    } else {
        process.exit(1);
    }
}

const unexpectedErrorHandler = (err) => {
    console.log(err);
    exitHandler();
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
        server.close();
    }
});