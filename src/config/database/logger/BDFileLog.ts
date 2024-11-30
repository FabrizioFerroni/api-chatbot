import { Logger as NestLogger } from '@nestjs/common';
import { AbstractLogger, LogLevel, LogMessage } from 'typeorm';
import { createLogger, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as dayjs from 'dayjs';

const entorno = process.env.NODE_ENV;

const transportApi = new DailyRotateFile({
  filename: `./logs/bd-${entorno || 'dev'}-%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  zippedArchive: true,
  maxSize: '10m',
  maxFiles: '1d',
});

const transportApiError = new DailyRotateFile({
  filename: `./logs/errors-bd-${entorno || 'dev'}-%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  zippedArchive: true,
  maxSize: '10m',
  maxFiles: '1d',
  level: 'error',
});

const appendTimestamp = format((info) => {
  info.timestamp = dayjs().format();
  return info;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.splat(),
    format.metadata(),
    appendTimestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [transportApi, transportApiError],
});

export default class BDFileLogs extends AbstractLogger {
  constructor(private nestLogger: NestLogger) {
    super(['query', 'error', 'schema', 'log', 'info', 'warn']);
  }

  /**
   * Write log to specific output.
   */
  protected writeLog(level: LogLevel, logMessage: LogMessage | LogMessage[]) {
    const messages = this.prepareLogMessages(logMessage, {
      highlightSql: false,
    });

    for (const message of messages) {
      const logMsg = message.message;

      switch (message.type ?? level) {
        case 'log':
        case 'schema-build':
        case 'migration':
          this.nestLogger.log(logMsg);
          logger.info(logMsg);
          break;

        case 'info':
        case 'query':
          this.nestLogger.log(logMsg);
          logger.info(logMsg);
          break;

        case 'warn':
        case 'query-slow':
          this.nestLogger.warn(logMsg);
          logger.warn(logMsg);
          break;

        case 'error':
        case 'query-error':
          this.nestLogger.error(logMsg);
          logger.error(logMsg);
          break;
      }
    }
  }
}
