import winston from 'winston';

winston.addColors({
  info: 'cyan',
  warn: 'yellow',
  error: 'red',
  debug: 'green',
});

const myFormat = winston.format.printf(({
  level, message, timestamp,
}) => `${timestamp} ${level}: ${message}`);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    (new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({ all: true }),
        myFormat,
      ),
    })),
  ],
});

export { logger };
