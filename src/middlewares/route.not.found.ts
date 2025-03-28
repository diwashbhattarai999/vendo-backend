import type { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { logger } from '@/logger/winston.logger';

/**
 * Route not found handler
 * @param req Request
 * @param _res Response
 * @returns void
 */
export const routeNotFoundHandler = (req: Request, _res: Response, _next: NextFunction) => {
  const t = req.t;

  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);

  throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.ROUTE_NOT_FOUND, t('route_not_found_message', { ns: 'error' }));
};
