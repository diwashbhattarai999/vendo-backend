import type { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { logger } from '@/logger/winston.logger';

/**
 * Middleware to handle 404 Not Found errors.
 *
 * This middleware is used to catch requests that do not match any defined routes.
 * It logs the request method and URL, and throws a custom error indicating that the route was not found.
 * This error is caught by a global error-handling middleware to send a standardized error response to the client.
 *
 * @param req - The Express request object.
 * @param _res - The Express response object (not used).
 * @param _next - The next middleware function (not used).
 * @throws CustomError - If the route is not found.
 */
export const routeNotFoundHandler = (req: Request, _res: Response, _next: NextFunction) => {
  const t = req.t;

  // Log the request method and URL for debugging purposes
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);

  // Create a custom error indicating that the route was not found
  throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.ROUTE_NOT_FOUND, t('route_not_found_message', { ns: 'error' }));
};
