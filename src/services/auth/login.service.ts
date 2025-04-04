import type { TFunction } from 'i18next';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { compareValue } from '@/utils/bcrypt';
import { refreshTokenSignOptions, signJwtToken } from '@/utils/jwt';
import { sanitizeUser } from '@/utils/sanitize.data';

import type { LoginType } from '@/schema/auth/login.schema';

import { createSession } from '../session.service';
import { getUserByEmail } from '../user.service';

import { logger } from '@/logger/winston.logger';

type LoginServicePayload = LoginType['body'] & { userAgent?: string };

/**
 * Service to handle user login.
 * It checks if the user exists, validates the password,
 * and generates access and refresh tokens for the user.
 */
export const loginService = async (t: TFunction, payload: LoginServicePayload) => {
  const { email, password, userAgent } = payload;

  logger.info(`Login attempt for email: ${email}`);

  // Check if the user exists, if not, throw an error
  const user = await getUserByEmail(email);
  if (!user) {
    logger.warn(`Failed login attempt: User not found for email: ${email}`);
    throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_INVALID_CREDENTIALS, t('login.invalid_credentials', { ns: 'auth' }));
  }

  // Check if the password is correct, if not, throw an error
  const isPasswordValid = await compareValue(password, user.password);
  if (!isPasswordValid) {
    logger.warn(`Failed login attempt: Invalid password for user ID: ${user.id}`);
    throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_INVALID_CREDENTIALS, t('login.invalid_credentials', { ns: 'auth' }));
  }

  // Check if the user enable 2fa retuen user= null
  if (user.userPreferences?.enable2FA) {
    logger.info(`2FA required for user ID: ${user.id}`);
    return {
      user: null,
      mfaRequired: true,
      accessToken: '',
      refreshToken: '',
    };
  }
  // Create a session for the user
  const session = await createSession(user.id, userAgent);
  logger.info(`Session created for user ID: ${user.id}`);

  // Generate access and refresh tokens
  const accessToken = signJwtToken({ userId: user.id, sessionId: session.id });
  const refreshToken = signJwtToken({ sessionId: session.id }, refreshTokenSignOptions);

  logger.info(`Login successful for user ID: ${user.id}`);
  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
    mfaRequired: false,
  };
};
