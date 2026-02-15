const winston = require('winston');
const config = require('./config');

// Jika log adalah instanceof Error, maka message akan diganti dengan stack trace (info.stack) dari error tersebut 
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info', // kalau NODE_ENV === 'development' maka level maksimum = dari error-debug, jika tidak maka hanya error-info
  format: winston.format.combine(
    enumerateErrorFormat(), // mengubah message log jika terjadi error
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(), // contoh splat: logger.info('User: %s, Age: %d', name, age);
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [ // log akan ditampilkan di console
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

module.exports = logger;
