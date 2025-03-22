import winston from 'winston';

import { EApplicationEnvironment } from '@/constant/application';

/**
 * Custom severity levels configuration.
 * Levels are ordered from most critical (error) to least critical (debug).
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

/**
 * Assigns colors to each log level for better visualization in console output.
 * These colors will be applied when viewing logs in a terminal that supports ANSI colors.
 */
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'magenta',
  debug: 'white',
});

/**
 * Custom log formatting configuration for file outputs.
 * Formats the log entry with timestamp, level, and message.
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
);

/**
 * Default log file paths, can be overridden by environment variables.
 */
const logDir = process.env.LOG_DIR || 'logs'; // You can define `LOG_DIR` in .env files
const errorLogPath = `${logDir}/error.log`;
const infoLogPath = `${logDir}/info.log`;

/**
 * Configure transports for the logger.
 * Transports define where the log entries are written to (e.g., files, console).
 */
const transports = [
  new winston.transports.File({
    filename: errorLogPath,
    level: 'error', // Log errors to this file
    format: fileFormat,
  }),
  new winston.transports.File({
    filename: infoLogPath,
    level: 'info', // Log info and above to this file
    format: fileFormat,
  }),
];

/**
 * Create a logger instance with appropriate log levels and transports.
 */
const logger = winston.createLogger({
  levels,
  transports,
  level: process.env.NODE_ENV === EApplicationEnvironment.DEVELOPMENT ? 'debug' : 'info', // Set log level based on environment
});

/**
 * Add a console transport in development mode.
 * This allows colored logs with timestamp for easier debugging.
 */
if (process.env.NODE_ENV === EApplicationEnvironment.DEVELOPMENT) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize({ all: false, message: true, level: true }), // Custom colorization
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
    }),
  );
}

export { logger };
