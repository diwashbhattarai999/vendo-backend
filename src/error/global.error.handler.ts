import type { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';
import { formatHttpError } from '@/error/format.http.error';

import { clearAuthenticationCookies, REFRESH_PATH } from '@/utils/cookie';

import { logger } from '@/logger/winston.logger';

/**
 * Middleware to handle global errors in the application.
 *
 * This middleware is used to catch and handle errors that occur during the request processing.
 * It formats the error response and sends it back to the client in a standardized format.
 * It also logs the error message for debugging purposes.
 *
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
export function globalErrorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
  const t = req.t;

  // Clear authentication cookies if the request path is for refresh
  if (req.path === REFRESH_PATH) clearAuthenticationCookies(res);

  /**
   * Create an instance of CustomError
   */
  const error = new CustomError(
    err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
    err.errorCode || ERROR_CODES.GENERAL_ERROR,
    err.message || t('general_error_message', { ns: 'error' }),
  );

  if (err instanceof SyntaxError) {
    error.statusCode = STATUS_CODES.BAD_REQUEST;
    error.errorCode = ERROR_CODES.INVALID_JSON_CONFIG;
    error.message = t('invalid_request_body', { ns: 'error' });
  }

  // Format the error
  const formatedError = formatHttpError(req, error);

  // Log the error on console in english
  logger.error(formatedError.message);

  // Send error response
  res.status(error.statusCode).json(formatedError);

  // Move to the next middleware with the error
  next();
}
