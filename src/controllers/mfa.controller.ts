import type { Request, Response } from 'express';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';
import { CustomError } from '@/error/custom.api.error';

import { setAuthenticationCookies } from '@/utils/cookie';
import { sendHttpResponse } from '@/utils/send.http.response';

import { generateMFASecret, revokeMFA, verifyMFAForLogin, verifyMFASetup } from '@/services/auth/mfa.service';

import type { VerifyMfaForLoginType, VerifyMfaSetupType } from '@/schema/auth/mfa.schema';

/**
 * Generate MFA API Controller
 * Generates a two-factor authentication (2FA) setup for the user.
 * It checks if MFA is already enabled, generates a new secret key,
 * and returns the QR code image URL for the user to scan with their authenticator app.
 */
export const generateMFAHandler = asyncCatch(async (req: Request, res: Response) => {
  const t = req.t;

  // Check if MFA is already enabled
  const user = req.user;
  if (!user) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('unauthorized', { ns: 'error' }));

  // Call the service to generate the 2FA secret
  const setupDetails = await generateMFASecret(user, t);

  // Send the response with the QR code and secret key
  sendHttpResponse(res, STATUS_CODES.OK, t('mfa.setup_instructions', { ns: 'auth' }), setupDetails);
});

/**
 * Verify MFA Setup API Controller
 * Verifies the two-factor authentication (2FA) setup for the user.
 * It checks if MFA is already enabled, verifies the OTP code,
 * and updates the user's preferences to enable MFA.
 */
export const verifyMFASetupHandler = asyncCatch(async (req: Request<{}, {}, VerifyMfaSetupType['body']>, res) => {
  const t = req.t;
  const { otpCode, secretKey } = req.body;

  // Check if MFA is already enabled
  const user = req.user;
  if (!user) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('unauthorized', { ns: 'error' }));

  // Call the service to verify the OTP code
  const { userPreferences } = await verifyMFASetup(otpCode, secretKey, t, user);

  // Send the response with the updated user preferences
  sendHttpResponse(res, STATUS_CODES.OK, t('mfa.verification_success', { ns: 'auth' }), userPreferences);
});

/**
 * Revoke MFA API Controller
 * Revokes the two-factor authentication (2FA) setup for the user.
 * It checks if MFA is enabled, revokes it, and updates the user's preferences.
 */
export const revokeMFAHandler = asyncCatch(async (req, res) => {
  const t = req.t;

  // Check if MFA is already enabled
  const user = req.user;
  if (!user) throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('unauthorized', { ns: 'error' }));

  // Call the service to revoke MFA
  const { userPreferences } = await revokeMFA(user, t);

  // Send the response with the updated user preferences
  sendHttpResponse(res, STATUS_CODES.OK, t('mfa.revoked', { ns: 'auth' }), userPreferences);
});

/**
 * Verify MFA for Login API Controller
 * Verifies the two-factor authentication (2FA) code for login.
 * It checks if MFA is enabled, verifies the OTP code, and returns the user and session details.
 */
export const verifyMFAForLoginHandler = asyncCatch(async (req: Request<{}, {}, VerifyMfaForLoginType['body']>, res) => {
  const t = req.t;
  const { otpCode, email } = req.body;
  const userAgent = req.headers['user-agent'];

  // Call the service to verify the OTP code for login
  const { accessToken, refreshToken, user } = await verifyMFAForLogin(otpCode, email, t, userAgent);

  // Set the session cookie in the response
  setAuthenticationCookies({ res, accessToken, refreshToken });

  // Send the response with the user and session details
  sendHttpResponse(res, STATUS_CODES.OK, t('mfa.login_success', { ns: 'auth' }), { user });
});
