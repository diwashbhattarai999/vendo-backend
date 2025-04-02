import type { TFunction } from 'i18next';
import qrcode from 'qrcode';
import speakeasy from 'speakeasy';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { refreshTokenSignOptions, signJwtToken } from '@/utils/jwt';

import { createSession } from './session.service';
import { updateUserPreferences } from './user.preferences.service';
import { getUserByEmail } from './user.service';

export const generateMFASecret = async (user: Express.User, t: TFunction) => {
  // Check if MFA is already enabled
  if (user.userPreferences?.enable2FA)
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_ALREADY_ENABLED, t('mfa.already_enabled', { ns: 'error' }));

  // Generate a new secret key for 2FA
  // If the user doesn't have a secret key, generate one and save it to the database
  // If the user has a secret key, use it to generate the QR code
  let secretKey = user.userPreferences?.twoFactorSecret;
  if (!secretKey) {
    const secret = speakeasy.generateSecret({ name: 'Vendo' });
    secretKey = secret.base32;

    await updateUserPreferences(user.id, { twoFactorSecret: secretKey });
  }

  // Generate the otpauth URL for the QR code
  // The otpauth URL is used to generate the QR code that the user will scan with their authenticator app
  const url = speakeasy.otpauthURL({
    secret: secretKey,
    label: `${user.firstName} ${user.lastName}`,
    issuer: 'vendo.com',
    encoding: 'base32',
  });

  // Generate the QR code image URL
  const qrImageUrl = await qrcode.toDataURL(url);

  return { secret: secretKey, qrImageUrl };
};

export const verifyMFASetup = async (otpCode: string, secretKey: string, t: TFunction, user: Express.User) => {
  if (user.userPreferences?.enable2FA)
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_ALREADY_ENABLED, t('mfa.already_enabled', { ns: 'error' }));

  // Verify the OTP code using the secret key
  const verified = speakeasy.totp.verify({
    secret: secretKey,
    encoding: 'base32',
    token: otpCode,
  });

  // If the OTP code is not valid, throw an error
  if (!verified) throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_INVALID_CODE, t('mfa.invalid_code', { ns: 'auth' }));

  // Update the user's preferences to enable MFA
  const updatedUserPreferences = await updateUserPreferences(user.id, { enable2FA: true });

  return { userPreferences: { enable2FA: updatedUserPreferences.enable2FA } };
};

export const revokeMFA = async (user: Express.User, t: TFunction) => {
  if (!user.userPreferences?.enable2FA)
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_NOT_ENABLED, t('mfa.not_enabled', { ns: 'auth' }));

  // Revoke MFA by removing the secret key and disabling MFA
  const updatedUserPreferences = await updateUserPreferences(user.id, { enable2FA: false, twoFactorSecret: null });

  return { userPreferences: { enable2FA: updatedUserPreferences.enable2FA } };
};

export const verifyMFAForLogin = async (otpCode: string, email: string, t: TFunction, userAgent?: string) => {
  // Fetch the user by email
  const user = await getUserByEmail(email);
  if (!user) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('unauthorized', { ns: 'error' }));

  // Check if MFA is enabled for the user
  if (!user.userPreferences?.enable2FA || !user.userPreferences.twoFactorSecret)
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_NOT_ENABLED, t('mfa.not_enabled', { ns: 'auth' }));

  // Verify the OTP code using the secret key
  const verified = speakeasy.totp.verify({
    secret: user.userPreferences.twoFactorSecret,
    encoding: 'base32',
    token: otpCode,
  });

  // If the OTP code is not valid, throw an error
  if (!verified) throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.MFA_INVALID_CODE, t('mfa.invalid_code', { ns: 'auth' }));

  // Create a session for the user, and generate access and refresh tokens
  const session = await createSession(user.id, userAgent);
  const accessToken = signJwtToken({ userId: user.id, sessionId: session.id });
  const refreshToken = signJwtToken({ sessionId: session.id }, refreshTokenSignOptions);

  // Return the access token, refresh token, and user information
  return { user, accessToken, refreshToken };
};
