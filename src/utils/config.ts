import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

interface Config {
  sessionToken?: string;
  logLevel?: LogLevel;
  logDir?: string;
}

function getConfig(): Config {
  const sessionToken = process.env['SESSION'];
  const logLevel = process.env['LOG_LEVEL'] as LogLevel | undefined;
  const logDir = process.env['LOG_DIR'];

  if (logLevel && !['fatal', 'error', 'warn', 'info', 'debug', 'trace'].includes(logLevel)) {
    console.warn('Invalid logLevel, using default: info');
  }

  return {
    sessionToken,
    logLevel,
    logDir,
  };
}

export const config = getConfig();
