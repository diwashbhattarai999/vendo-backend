import type { Request, Response } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { clearAuthenticationCookies } from '@/utils/cookie';

import { deleteSessionById } from '../db/session.service';

export const logoutService = async (req: Request, res: Response) => {
  const t = req.t;

  // Extract the session ID from the request
  const sessionId = req.sessionId;
  if (!sessionId) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_SESSION_NOT_FOUND, t('session.not_found', { ns: 'auth' }));

  // Call the logout service to delete the session
  await deleteSessionById(sessionId);

  // Clear the authentication cookies
  clearAuthenticationCookies(res);
};
