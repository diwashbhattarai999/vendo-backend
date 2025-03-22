import type { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { env } from '@/config/env';

import { EApplicationEnvironment } from '@/constant/application';

import type { CustomError } from '@/error/custom.api.error';

/**
 * This function will format the error response in a structured way.
 *
 * @param req: Request
 * @param error: CustomError
 * @returns: object
 */
export const formatHttpError = (req: Request, error: CustomError) => {
  return {
    success: false,
    status: 'error',
    statusCode: error.statusCode,
    error: {
      errorId: uuidv4(),
      name: error.name,

      code: error.errorCode,
      message: error.message,
      details: error.details,
      suggestion: error.suggestion,

      ip: req.clientIp,

      url: req.originalUrl,
      method: req.method,

      timestamp: error.timestamp.toISOString(),

      /**
       * @description: This is a DEV mode only feature.
       * It will show the stack trace of the error.
       */
      stack: env.app.NODE_ENV === EApplicationEnvironment.DEVELOPMENT ? error.stack : 'Please enable DEV mode to see the stack trace',
    },
  };
};
