// const mongoose = require('mongoose');
const { pool } = require('./middlewares/db');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
/*
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});
*/
server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

// db.createConnection(config.mysql.options).then(() => {
//   logger.info('Connected to MySQL');
//
// });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

process.on('SIGINT', () => {
  logger.info('SIGINT received');
  if (server) {
    server.close();
  }
});
