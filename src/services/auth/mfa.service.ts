import type { TFunction } from 'i18next';
import qrcode from 'qrcode';
import speakeasy from 'speakeasy';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { type AccessTPayload, refreshTokenSignOptions, type RefreshTPayload, signJwtToken } from '@/utils/jwt';

import { createSession } from '../db/session.service';
import { updateUserPreferences } from '../db/user.preferences.service';
import { getUserByEmail } from '../db/user.service';

import { logger } from '@/logger/winston.logger';

/**
 * Service to generate the MFA secret and corresponding QR code.
 * It checks if MFA is already enabled, generates a secret key if not,
 * and returns the QR code URL for user setup.
 */
export const generateMFASecret = async (user: Express.User, t: TFunction) => {
  logger.debug(`Attempting to generate MFA secret for user ID: ${user.id}`);

  // Check if MFA is already enabled
  if (user.userPreferences?.isTwoFactorEnabled) {
    logger.warn(`MFA already enabled for user ID: ${user.id}`);
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_ALREADY_ENABLED, t('mfa.already_enabled', { ns: 'auth' }));
  }

  // Generate a new secret key if one doesn't exist
  let secretKey = user.userPreferences?.twoFactorSecret;
  if (!secretKey) {
    logger.info(`Generating new MFA secret for user ID: ${user.id}`);
    const secret = speakeasy.generateSecret({ name: 'Vendo' });
    secretKey = secret.base32;

    // Save the secret key to the user's preferences
    await updateUserPreferences(user.id, { twoFactorSecret: secretKey });
    logger.info(`New MFA secret generated and saved for user ID: ${user.id}`);
  }

  // Generate the otpauth URL for the QR code
  const url = speakeasy.otpauthURL({
    secret: secretKey,
    label: `${user.firstName} ${user.lastName}`,
    issuer: 'vendo.com',
    encoding: 'base32',
  });

  // Generate the QR code image URL
  const qrImageUrl = await qrcode.toDataURL(url);
  logger.info(`QR code generated for user ID: ${user.id}`);

  return { secret: secretKey, qrImageUrl };
};

/**
 * Service to verify MFA setup by checking the OTP code and enabling MFA for the user.
 * It validates the OTP and updates the user's preferences to enable 2FA.
 */
export const verifyMFASetup = async (otpCode: string, secretKey: string, t: TFunction, user: Express.User) => {
  logger.debug(`Verifying MFA setup for user ID: ${user.id}`);

  if (user.userPreferences?.isTwoFactorEnabled) {
    logger.warn(`MFA already enabled for user ID: ${user.id}`);
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_ALREADY_ENABLED, t('mfa.already_enabled', { ns: 'auth' }));
  }

  // Verify the OTP code using the secret key
  const verified = speakeasy.totp.verify({
    secret: secretKey,
    encoding: 'base32',
    token: otpCode,
  });

  // If the OTP code is not valid, throw an error
  if (!verified) {
    logger.warn(`Invalid MFA code attempt for user ID: ${user.id}`);
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_INVALID_CODE, t('mfa.invalid_code', { ns: 'auth' }));
  }

  // Update the user's preferences to enable MFA
  const updatedUserPreferences = await updateUserPreferences(user.id, { isTwoFactorEnabled: true });
  logger.info(`MFA setup successfully completed for user ID: ${user.id}`);

  return { userPreferences: { isTwoFactorEnabled: updatedUserPreferences.isTwoFactorEnabled } };
};

/**
 * Service to revoke MFA for a user by disabling 2FA and removing the secret key.
 */
export const revokeMFA = async (user: Express.User, t: TFunction) => {
  logger.debug(`Revoking MFA for user ID: ${user.id}`);

  if (!user.userPreferences?.isTwoFactorEnabled) {
    logger.warn(`MFA not enabled for user ID: ${user.id}`);
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_NOT_ENABLED, t('mfa.not_enabled', { ns: 'auth' }));
  }

  // Disable MFA and remove the secret key
  const updatedUserPreferences = await updateUserPreferences(user.id, { isTwoFactorEnabled: false, twoFactorSecret: null });
  logger.info(`MFA successfully revoked for user ID: ${user.id}`);

  return { userPreferences: { isTwoFactorEnabled: updatedUserPreferences.isTwoFactorEnabled } };
};

/**
 * Service to verify MFA during the login process.
 * It checks if MFA is enabled, verifies the OTP code,
 * and generates session tokens upon successful verification.
 */
export const verifyMFAForLogin = async (otpCode: string, email: string, t: TFunction, userAgent?: string) => {
  logger.debug(`MFA verification attempt for email: ${email}, userAgent: ${userAgent || 'N/A'}`);

  // Fetch the user by email
  const user = await getUserByEmail(email);
  if (!user) {
    logger.warn(`Login attempt failed: User not found for email: ${email}`);
    throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('unauthorized', { ns: 'error' }));
  }

  // Check if MFA is enabled for the user
  if (!user.userPreferences?.isTwoFactorEnabled || !user.userPreferences.twoFactorSecret) {
    logger.warn(`Login attempt failed: MFA not enabled for user email: ${email}`);
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_NOT_ENABLED, t('mfa.not_enabled', { ns: 'auth' }));
  }

  // Verify the OTP code using the secret key
  const verified = speakeasy.totp.verify({
    secret: user.userPreferences.twoFactorSecret,
    encoding: 'base32',
    token: otpCode,
  });

  // If the OTP code is not valid, throw an error
  if (!verified) {
    logger.warn(`Invalid MFA code provided for email: ${email}`);
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_INVALID_CODE, t('mfa.invalid_code', { ns: 'auth' }));
  }

  logger.info(`MFA successfully verified for email: ${email}`);

  // Create a session for the user, and generate access and refresh tokens
  const session = await createSession(user.id, userAgent);
  const accessToken = signJwtToken<AccessTPayload>({ userId: user.id, sessionId: session.id, role: user.role });
  const refreshToken = signJwtToken<RefreshTPayload>({ sessionId: session.id }, refreshTokenSignOptions);

  logger.info(`Session created for user ID: ${user.id}, accessToken: ${accessToken}`);

  // Return the access token, refresh token, and user information
  return { user, accessToken, refreshToken };
};
