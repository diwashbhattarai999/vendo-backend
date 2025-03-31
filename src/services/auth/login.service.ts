import type { TFunction } from 'i18next';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { compareValue } from '@/utils/bcrypt';
import { thirtyDaysFromNow } from '@/utils/date.time';
import { refreshTokenSignOptions, signJwtToken } from '@/utils/jwt';

import type { LoginType } from '@/schema/auth/login.schema';

import { getUserByEmail } from '../user.service';

import prisma from '@/database/prisma-client';

type LoginServicePayload = LoginType['body'] & { userAgent?: string };

export const loginService = async (t: TFunction, payload: LoginServicePayload) => {
  const { email, password, userAgent } = payload;

  // Check if the user exists, if not, throw an error
  const user = await getUserByEmail(email);
  if (!user) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_INVALID_CREDENTIALS, t('login.invalid_credentials', { ns: 'auth' }));

  // Check if the password is correct, if not, throw an error
  const isPasswordValid = await compareValue(password, user.password);
  if (!isPasswordValid)
    throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_INVALID_CREDENTIALS, t('login.invalid_credentials', { ns: 'auth' }));

  // TODO: Check if user has enabled 2FA

  // Create a session for the user
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      userAgent,
      expiresAt: thirtyDaysFromNow(),
    },
  });

  // Create a access token for the user
  const accessToken = signJwtToken({ userId: user.id, sessionId: session.id });

  // Create a refresh token for the user
  const refreshToken = signJwtToken({ sessionId: session.id }, refreshTokenSignOptions);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- We need to remove the password from the response
  const { password: _, ...userWithoutPassword } = user;

  // Return the access token and refresh token
  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
    mfaRequired: false,
  };
};
