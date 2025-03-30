import jwt from 'jsonwebtoken';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { compareValue } from '@/utils/bcrypt';
import { thirtyDaysFromNow } from '@/utils/date.time';

import type { LoginType } from '@/schema/auth/login.schema';

import { getUserByEmail } from '../user.service';

import prisma from '@/database/prisma-client';

type LoginServiceParams = LoginType['body'] & {
  userAgent?: string;
};

export const loginService = async (data: LoginServiceParams) => {
  const { email, password, userAgent } = data;

  // Check if the user exists, if not, throw an error
  const user = await getUserByEmail(email);
  if (!user) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_INVALID_CREDENTIALS, 'Invalid email or password');

  // Check if the password is correct, if not, throw an error
  const isPasswordValid = await compareValue(password, user.password);
  if (!isPasswordValid) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_INVALID_CREDENTIALS, 'Invalid email or password');

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
  const accessToken = jwt.sign({ userId: user.id, sessionId: session.id }, env.jwt.ACCESS_TOKEN_SECRET as string, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expiresIn: env.jwt.EXPIRES_IN as any,
  });

  // Create a refresh token for the user
  const refreshToken = jwt.sign({ sessionId: session.id }, env.jwt.REFRESH_TOKEN_SECRET as string, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expiresIn: env.jwt.REFRESH_EXPIRES_IN as any,
  });

  // Return the access token and refresh token
  return {
    user,
    accessToken,
    refreshToken,
    mfaRequired: false,
  };
};
