import type { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

export const isAuthenticated = async (req: Request, _res: Response, next: NextFunction) => {
  const t = req.t;
  const user = req.user;

  // Check if the user is authenticated
  if (!user) return next(new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('unauthorized', { ns: 'error' })));

  // Check if the user's email is verified
  if (!user?.isEmailVerified)
    return next(new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.EMAIL_NOT_VERIFIED, t('email.not_verified', { ns: 'error' })));

  // Check if the user is active, if not, return an error
  if (!user?.isActive) return next(new CustomError(STATUS_CODES.FORBIDDEN, ERROR_CODES.ACCOUNT_DEACTIVATED, t('user.account_deactivated')));

  next();
};
