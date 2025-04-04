import type { TFunction } from 'i18next';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';
import { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { CustomError } from '@/error/custom.api.error';

import { updateUser } from '../user.service';
import { deleteVerificationToken, findVerificationToken } from '../verification.service';

/**
 * Service to handle email verification.
 * It checks if the verification token is valid,
 * updates the user's email verification status,
 * and deletes the verification token.
 */
export const verifyEmailService = async (t: TFunction, token: string) => {
  // Check if the verification token is provided, if not, throw an error
  const validToken = await findVerificationToken(token, VERIFICATION_TYPES.EMAIL_VERIFICATION);
  if (!validToken)
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      ERROR_CODES.VERIFICATION_CODE_INVALID_OR_EXPIRED,
      t('verify_email.invlalid_or_expired_token', { ns: 'auth' }),
    );

  // If the verification token is valid, update the user's email verification status
  const updatedUser = await updateUser(validToken.userId, { isEmailVerified: true });

  // If the user is not found or the update fails, throw an error
  if (!updatedUser)
    throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.UNABLE_TO_VERIFY_EMAIL, t('verify_email.failure', { ns: 'auth' }));

  // Delete the verification token after successful verification
  await deleteVerificationToken(validToken.token, VERIFICATION_TYPES.EMAIL_VERIFICATION, validToken.userId);

  // Return the updated user object
  return { user: updatedUser };
};
