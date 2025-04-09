import type { NextFunction, Request, Response } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { getUserById } from '@/services/db/user.service';

export const checkActiveUser = async (req: Request, _res: Response, next: NextFunction) => {
  const t = req.t;
  const userId = req.user?.id;

  // Check if the user ID is present in the request
  if (!userId) return next(new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('unauthorized', { ns: 'error' })));

  // Fetch the user from the database using the user ID
  const user = await getUserById(userId);

  // Check if the user is active, if not, return an error
  if (!user?.isActive) return next(new CustomError(STATUS_CODES.FORBIDDEN, ERROR_CODES.ACCOUNT_DEACTIVATED, t('user.account_deactivated')));

  // If the user is active, proceed to the next middleware
  next();
};
