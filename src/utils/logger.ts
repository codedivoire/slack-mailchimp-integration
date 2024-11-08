import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, service }) => {
  return `${timestamp} [${service}] ${level}: ${message}`;
});

export const createLogger = (service: string) => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
      timestamp(),
      colorize(),
      customFormat
    ),
    defaultMeta: { service },
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
      }),
    ],
  });
};

export const logger = createLogger('app');