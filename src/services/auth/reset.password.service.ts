import type { TFunction } from 'i18next';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';
import { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { CustomError } from '@/error/custom.api.error';

import { compareValue, hashValue } from '@/utils/bcrypt';

import type { ResetPasswordType } from '@/schema/auth/password.schema';

import { deleteSessionByUserId } from '../session.service';
import { getUserById, updateUser } from '../user.service';
import { deleteVerificationToken, findVerificationToken } from '../verification.service';

/**
 * Service to handle the password reset process.
 * It checks if the verification token is valid, updates the user's password,
 * and deletes the verification token and session.
 */
export const resetPasswordService = async (t: TFunction, payload: ResetPasswordType['body']) => {
  const { password, verificationToken } = payload;

  // Check if the verification code is valid
  const validToken = await findVerificationToken(verificationToken, VERIFICATION_TYPES.PASSWORD_RESET, { gt: new Date() });
  if (!validToken)
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      ERROR_CODES.VERIFICATION_CODE_INVALID_OR_EXPIRED,
      t('reset_password.invalid_token', { ns: 'auth' }),
    );

  // Get the user associated with the verification token
  const user = await getUserById(validToken.userId);
  if (!user) throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND, t('user_not_found', { ns: 'error' }));

  // Check if the new password is the same as the old password
  const isSamePassword = await compareValue(password, user.password);
  if (isSamePassword)
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.AUTH_PASSWORD_SAME, t('reset_password.same_password', { ns: 'auth' }));

  // Hash the new password
  const hashedPassword = await hashValue(password);

  // Update the user's password in the database
  const updatedUser = await updateUser(validToken.userId, { password: hashedPassword });
  if (!updatedUser) throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.GENERAL_ERROR, t('reset_password.failure', { ns: 'auth' }));

  // Delete the verification token after successful password reset
  await deleteVerificationToken(validToken.token, VERIFICATION_TYPES.PASSWORD_RESET, validToken.userId);

  // Delete the session token if it exists
  await deleteSessionByUserId(validToken.userId);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- We need to remove the password from the response
  const { password: _, ...sanitizedUser } = updatedUser;

  return { user: sanitizedUser };
};
