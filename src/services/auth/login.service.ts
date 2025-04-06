import { addMinutes, isBefore } from 'date-fns';
import type { TFunction } from 'i18next';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { compareValue } from '@/utils/bcrypt';
import { refreshTokenSignOptions, signJwtToken } from '@/utils/jwt';
import { sanitizeUser } from '@/utils/sanitize.data';

import type { LoginType } from '@/schema/auth/login.schema';

import { createLoginAttempt, getLoginAttemptByIp, resetLoginAttempts, updateLoginAttempt } from '../db/login.attempts.service';
import { createSession } from '../db/session.service';
import { getUserByEmail } from '../db/user.service';

import { logger } from '@/logger/winston.logger';
import { sendEmail } from '@/mailers/mailer';
import { blockedLoginTemplate } from '@/mailers/templates/blocked.login.template';

type LoginServicePayload = LoginType['body'] & { userAgent?: string; ipAddress: string };

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MINUTES = 1;

/**
 * Service to handle user login.
 * It checks if the user exists, validates the password,
 * and generates access and refresh tokens for the user.
 */
export const loginService = async (t: TFunction, payload: LoginServicePayload) => {
  const { email, password, userAgent, ipAddress } = payload;

  logger.debug(`Processing login for email: ${email}`);

  // Check if the user exists, if not, throw an error
  const user = await getUserByEmail(email);
  if (!user) {
    logger.warn(`Login failed: No user found for email: ${email}`);
    throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_INVALID_CREDENTIALS, t('login.invalid_credentials', { ns: 'auth' }));
  }

  // Check if the password is correct, if not, throw an error
  const isPasswordValid = await compareValue(password, user.password);
  if (!isPasswordValid) {
    logger.warn(`Login failed: Incorrect password for user ID: ${user.id}`);

    // Track failed login attempts
    await checkAndTrackFailedLoginAttempts(t, ipAddress, user.email, userAgent);

    // Throw an error if the password is incorrect
    throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.AUTH_INVALID_CREDENTIALS, t('login.invalid_credentials', { ns: 'auth' }));
  }

  // Reset login attempts on successful login
  const attempt = await getLoginAttemptByIp(ipAddress);
  if (attempt) {
    await resetLoginAttempts(attempt.id);
    logger.info(`Login attempts reset for IP: ${ipAddress}`);
  }

  // Check if the user enable 2fa retuen user= null
  if (user.userPreferences?.isTwoFactorEnabled) {
    logger.info(`2FA required for login. User ID: ${user.id}`);
    return { user: null, mfaRequired: true, accessToken: '', refreshToken: '' };
  }

  // Create a session for the user
  const session = await createSession(user.id, userAgent);
  logger.info(`Session created for user ID: ${user.id}, session ID: ${session.id}`);

  // Generate access and refresh tokens
  const accessToken = signJwtToken({ userId: user.id, sessionId: session.id });
  const refreshToken = signJwtToken({ sessionId: session.id }, refreshTokenSignOptions);

  logger.info(`Login successful. User ID: ${user.id}`);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
    mfaRequired: false,
  };
};

const checkAndTrackFailedLoginAttempts = async (t: TFunction, ipAddress: string, email: string, userAgent?: string) => {
  const now = new Date();
  const attempt = await getLoginAttemptByIp(ipAddress);

  if (attempt) {
    // Check if the user is blocked and if the block duration has not expired
    if (attempt.blockedUntil && isBefore(now, attempt.blockedUntil)) {
      const remainingTimeInMin = Math.ceil((attempt.blockedUntil.getTime() - now.getTime()) / (1000 * 60));
      logger.warn(`Login blocked for IP: ${ipAddress}. Remaining block time: ${remainingTimeInMin} mins`);

      // Throw an error if the user is blocked
      throw new CustomError(
        STATUS_CODES.FORBIDDEN,
        ERROR_CODES.AUTH_BLOCKED,
        t('login.too_many_attempts', { ns: 'auth', minutes: remainingTimeInMin }),
      );
    }

    // Reset the attempts if the block duration has expired
    if (attempt.blockedUntil && now >= attempt.blockedUntil) {
      logger.info(`Block duration expired for IP: ${ipAddress}. Resetting login attempts.`);
      await resetLoginAttempts(attempt.id);
      return;
    }

    const newAttempts = attempt.attempts + 1;
    const isNowBlocked = newAttempts >= MAX_ATTEMPTS;
    const blockedUntil = isNowBlocked ? addMinutes(now, BLOCK_DURATION_MINUTES) : undefined;

    // Update the login attempt record with the new attempts count and block status
    await updateLoginAttempt({
      id: attempt.id,
      attempts: newAttempts,
      lastAttemptAt: now,
      blockedUntil,
      userAgent,
    });

    // Send a email to the user if they are blocked
    if (isNowBlocked) {
      const resetUrl = `${process.env.CLIENT_URL}/auth/forgot-password`;
      await sendEmail({ t, to: email, ...blockedLoginTemplate(BLOCK_DURATION_MINUTES, resetUrl) });
    }
    logger.info(`Login attempt recorded for IP: ${ipAddress}. Attempts: ${newAttempts}`);
  } else {
    // If no previous attempts, create a new record
    await createLoginAttempt({ userAgent, ipAddress });
  }
};
