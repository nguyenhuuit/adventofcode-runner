import path from 'path';
import pino from 'pino';

import { config } from '@utils/config';
import { FileUtil } from '@utils/file';

const DEFAULT_LOG_DIR = 'logs';

class Logger {
  private static instance: Logger;
  private logger: pino.Logger;

  private constructor() {
    // If logLevel is not configured, create a no-op logger
    if (!config.logLevel) {
      this.logger = pino({ enabled: false });
      return;
    }

    try {
      const logDir = path.resolve(process.cwd(), config.logDir || DEFAULT_LOG_DIR);
      if (!FileUtil.exists(logDir)) {
        FileUtil.createDirectory(logDir);
      }

      const logFile = path.join(logDir, 'app.log');

      this.logger = pino({
        level: config.logLevel,
        timestamp: pino.stdTimeFunctions.isoTime,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: false,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
            destination: logFile,
          },
        },
      });
    } catch (error) {
      console.error('Failed to create log directory:', error);
      this.logger = pino({ enabled: false });
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }
}

export const logger = Logger.getInstance();
