import type { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

import type { CustomError } from '@/error/custom.api.error';

import { isDevelopment } from '@/utils/env.utils';

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
    message: error.message,
    error: {
      errorId: uuidv4(),
      name: error.name,
      code: error.errorCode,
      ip: req.clientIp,
      url: req.originalUrl,
      method: req.method,
      timestamp: error.timestamp.toISOString(),
      ...(isDevelopment && { stack: error.stack }), // Only show stack trace in development environment
    },
  };
};
