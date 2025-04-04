import type { TFunction } from 'i18next';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';
import { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { CustomError } from '@/error/custom.api.error';

import { sanitizeUser } from '@/utils/sanitize.data';

import { updateUser } from '../user.service';
import { deleteVerificationToken, findVerificationToken } from '../verification.service';

import { logger } from '@/logger/winston.logger';

/**
 * Service to handle email verification.
 * It checks if the verification token is valid,
 * updates the user's email verification status,
 * and deletes the verification token.
 */
export const verifyEmailService = async (t: TFunction, token: string) => {
  logger.debug(`Verifying email with token: ${token.substring(0, 6)}...`);

  // Check if the verification token is provided, if not, throw an error
  const validToken = await findVerificationToken(token, VERIFICATION_TYPES.EMAIL_VERIFICATION);
  if (!validToken) {
    logger.warn(`Invalid or expired email verification token: ${token.substring(0, 6)}...`);
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      ERROR_CODES.VERIFICATION_CODE_INVALID_OR_EXPIRED,
      t('verify_email.invlalid_or_expired_token', { ns: 'auth' }),
    );
  }

  logger.info(`Valid email verification token for user ID: ${validToken.userId}`);

  // If the verification token is valid, update the user's email verification status
  const updatedUser = await updateUser(validToken.userId, { isEmailVerified: true });

  // If the user is not found or the update fails, throw an error
  if (!updatedUser) {
    logger.error(`Failed to verify email for user ID: ${validToken.userId}`);
    throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.UNABLE_TO_VERIFY_EMAIL, t('verify_email.failure', { ns: 'auth' }));
  }

  logger.info(`Email successfully verified for user ID: ${updatedUser.id}`);

  // Delete the verification token after successful verification
  await deleteVerificationToken(validToken.token, VERIFICATION_TYPES.EMAIL_VERIFICATION, validToken.userId);
  logger.debug(`Verification token deleted for user ID: ${updatedUser.id}`);

  // Return the updated user object
  return { user: sanitizeUser(updatedUser) };
};
