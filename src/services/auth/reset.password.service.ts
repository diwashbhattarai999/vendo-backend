import type { TFunction } from 'i18next';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';
import { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { CustomError } from '@/error/custom.api.error';

import { compareValue, hashValue } from '@/utils/bcrypt';
import { sanitizeUser } from '@/utils/sanitize.data';

import type { ResetPasswordType } from '@/schema/auth/password.schema';

import { deleteSessionByUserId } from '../db/session.service';
import { getUserById, updateUser } from '../db/user.service';
import { deleteVerificationToken, findVerificationToken } from '../db/verification.service';

import { logger } from '@/logger/winston.logger';

/**
 * Service to handle the password reset process.
 * It checks if the verification token is valid, updates the user's password,
 * and deletes the verification token and session.
 */
export const resetPasswordService = async (t: TFunction, payload: ResetPasswordType['body']) => {
  const { password, verificationToken } = payload;

  logger.debug(`Password reset attempt with token: ${verificationToken.substring(0, 6)}...`);

  // Check if the verification code is valid
  const validToken = await findVerificationToken(verificationToken, VERIFICATION_TYPES.PASSWORD_RESET, { gt: new Date() });
  if (!validToken) {
    logger.warn(`Invalid or expired reset token: ${verificationToken.substring(0, 6)}...`);
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      ERROR_CODES.VERIFICATION_CODE_INVALID_OR_EXPIRED,
      t('reset_password.invalid_token', { ns: 'auth' }),
    );
  }

  // Get the user associated with the verification token
  const user = await getUserById(validToken.userId);
  if (!user) {
    logger.warn(`Reset password failed: No user found for token user ID: ${validToken.userId}`);
    throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND, t('user_not_found', { ns: 'error' }));
  }

  // Check if the new password is the same as the old password
  const isSamePassword = await compareValue(password, user.password!);
  if (isSamePassword) {
    logger.warn(`Reset password failed: New password is the same as the current one for user ID: ${user.id}`);
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.AUTH_PASSWORD_SAME, t('reset_password.same_password', { ns: 'auth' }));
  }

  // Hash the new password
  const hashedPassword = await hashValue(password);
  logger.debug(`Password hashed for user ID: ${user.id}`);

  // Update the user's password in the database
  const updatedUser = await updateUser(validToken.userId, { password: hashedPassword });
  if (!updatedUser) {
    logger.error(`Failed to update password for user ID: ${user.id}`);
    throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.GENERAL_ERROR, t('reset_password.failure', { ns: 'auth' }));
  }

  logger.info(`Password updated successfully for user ID: ${user.id}`);

  // Delete the verification token after successful password reset
  await deleteVerificationToken(validToken.token, VERIFICATION_TYPES.PASSWORD_RESET, validToken.userId);
  logger.debug(`Reset token deleted for user ID: ${user.id}`);

  // Delete the session token if it exists
  await deleteSessionByUserId(validToken.userId);
  logger.info(`All sessions invalidated for user ID: ${user.id}`);

  return { user: sanitizeUser(updatedUser) };
};
