import { type Request } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';
import { CustomError } from '@/error/custom.api.error';

import { sendHttpResponse } from '@/utils/send.http.response';

import { getUserById, updateUser } from '@/services/db/user.service';

/**
 * Activate User Account API Controller
 * Handles user account activation requests by validating the request body,
 * calling the update user service, and sending a response.
 * This action can only be performed by an admin.
 */
export const activateUserAccountHandler = asyncCatch(async (req: Request<{ userId: string }>, res) => {
  const t = req.t;

  // Extract the user ID from the request parameters
  const { userId } = req.params;

  // Check if the user exists
  const user = await getUserById(userId);
  if (!user) throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND, t('user.not_found'));

  // Check if the user is already active
  if (user.isActive) throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.USER_ALREADY_ACTIVE, t('user.already_active'));

  // Activate the user account
  await updateUser(userId, { isActive: true });

  // Send a success response indicating that the user account was activated
  sendHttpResponse(res, STATUS_CODES.OK, t('admin.user_account_activated'));
});
