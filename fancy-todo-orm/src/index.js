const app = require('./app');
const prisma = require('../prisma/client');
const router = require('./routes');

let server;
let port = 3000;

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
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});

app.use(router);
