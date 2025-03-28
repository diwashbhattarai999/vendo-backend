import morgan from 'morgan';

import { isDevelopment } from '@/utils/env.utils';

import { logger } from '@/logger/winston.logger';

/**
 * Custom stream configuration for Morgan.
 * This redirects Morgan's output to our Winston logger's http level
 * instead of the default stdout, allowing for unified logging.
 */
const stream = {
  // Receives the log message from Morgan and passes it to Winston
  write: (message: string) => logger.http(message.trim()),
};

/**
 * Determines whether Morgan should skip logging certain requests.
 * In this configuration, HTTP logging is only active in development environment.
 *
 * @returns {boolean} true to skip logging, false to log the request
 */
const skip = () => {
  // Skip HTTP request logging in non-development environments
  return !isDevelopment;
};

/**
 * Configured Morgan middleware that logs HTTP requests.
 * Format: "IP_ADDRESS HTTP_METHOD URL STATUS_CODE - RESPONSE_TIME ms"
 *
 * Example output: "::1 GET /api/users 200 - 8.234 ms"
 *
 * Morgan is configured to:
 * - Log only in development environment (skipped in production)
 * - Send logs to Winston's http level via the custom stream
 */
const morganMiddleware = morgan(
  // Log format string:
  ':remote-addr :method :url :status - :response-time ms',
  // Options:
  { stream, skip },
);

export default morganMiddleware;
