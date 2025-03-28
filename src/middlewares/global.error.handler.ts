import type { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';
import { formatHttpError } from '@/error/format.http.error';

import { logger } from '@/logger/winston.logger';

export function globalErrorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
  const t = req.t;

  /**
   * Create an instance of CustomError
   */
  const error = new CustomError(
    err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
    err.errorCode || ERROR_CODES.GENERAL_ERROR,
    err.message || t('general_error_message', { ns: 'error' }),
  );

  // Format the error
  const formatedError = formatHttpError(req, error);

  // Log the error on console in english
  logger.error(formatedError.error.message);

  // Send error response
  res.status(error.statusCode).json(formatedError);

  // Move to the next middleware with the error
  next();
}
