import type { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { getUserByEmail } from '@/services/db/user.service';

export const checkActiveUser = async (req: Request, _res: Response, next: NextFunction) => {
  const t = req.t;
  const { email } = req.body;

  const user = await getUserByEmail(email);

  // Check if the user is present in the request
  if (!user) return next(new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.NOT_FOUND, t('user.not_found')));

  // Check if the user is active, if not, return an error
  if (!user?.isActive) return next(new CustomError(STATUS_CODES.FORBIDDEN, ERROR_CODES.ACCOUNT_DEACTIVATED, t('user.account_deactivated')));

  // If the user is active, proceed to the next middleware
  next();
};
