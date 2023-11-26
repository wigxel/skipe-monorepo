import { existsSync, mkdirSync } from 'fs';
import winston, { configure, transports, format } from 'winston';
import { appConfig } from '../config/config';

const ExbLogger = (): void => {
  if (!appConfig.NODE_ENV) appConfig.NODE_ENV = 'development';

  const loggerTransports: winston.transport[] = [];

  if (!existsSync('logs')) {
    mkdirSync('logs', {
      recursive: true,
    });
  }

  if (appConfig.NODE_ENV === 'development') {
    loggerTransports.push(
      new transports.File({
        level: 'info',
        filename: 'logs/development.log',
      }),
      new transports.File({
        level: 'error',
        filename: 'logs/development-error.log',
      })
    );
  }

  if (appConfig.NODE_ENV === 'production') {
    loggerTransports.push(
      new transports.File({
        level: 'info',
        filename: 'logs/production.log',
      }),
      new transports.File({
        level: 'error',
        filename: 'logs/production-error.log',
      })
    );
  }

  if (appConfig.NODE_ENV === 'test') {
    loggerTransports.push(
      new transports.File({
        level: 'info',
        filename: 'logs/test.log',
      }),
      new transports.File({
        level: 'error',
        filename: 'logs/test-error.log',
      })
    );
  }

  if (appConfig.NODE_ENV === 'staging') {
    loggerTransports.push(
      new transports.File({
        level: 'info',
        filename: 'logs/staging.log',
      }),
      new transports.File({
        level: 'error',
        filename: 'logs/staging-error.log',
      })
    );
  }

  configure({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service: `${appConfig.APP_NAME}` },
    transports: loggerTransports,
    exitOnError: false,
  });
  if (appConfig.NODE_ENV === 'development') {
    winston.add(
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      })
    );
  }
};

export default ExbLogger;
