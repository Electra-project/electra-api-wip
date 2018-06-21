const winston = require('winston');
const config = require('../../../configs/config');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [new winston.transports.Console(config.loggerOptions.console),
    new winston.transports.File(config.loggerOptions.file),
  ],
  exitOnError: false, // do not exit on handled exceptions
});
module.exports = logger;
