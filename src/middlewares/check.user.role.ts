import type { UserRole } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

/**
 * Middleware to check if the user has the required role(s).
 * This middleware checks if the user is authenticated and if their role matches one of the required roles.
 */
export const checkRole = (requiredRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const t = req.t;

    // Ensure the user is authenticated
    if (!req.user) {
      throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('unauthorized', { ns: 'error' }));
    }

    // Check if the user's role is in the list of required roles
    if (!requiredRoles.includes(req.user.role)) {
      throw new CustomError(STATUS_CODES.FORBIDDEN, ERROR_CODES.FORBIDDEN, t('forbidden', { ns: 'error' }));
    }

    next();
  };
};
