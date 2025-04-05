import type { Request } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

export const getAuthenticatedUser = async (req: Request) => {
  const t = req.t;

  const user = req.user;
  if (!user) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('unauthorized', { ns: 'error' }));

  return user;
};
