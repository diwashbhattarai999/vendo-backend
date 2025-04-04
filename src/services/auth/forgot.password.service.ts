import type { TFunction } from 'i18next';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';
import { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { CustomError } from '@/error/custom.api.error';

import { anHourFromNow, threeMinutesAgo } from '@/utils/date.time';

import { getUserByEmail } from '../user.service';
import { countVerificationTokens, generateVerificationTokenForPasswordReset } from '../verification.service';

import { sendEmail } from '@/mailers/mailer';
import { passwordResetTemplate } from '@/mailers/templates/password.reset.template';

/**
 * Service to handle the password reset process.
 * It checks if the user exists, counts the number of password reset emails sent in the last 3 minutes,
 * generates a new password reset token, and sends the password reset email to the user.
 */
export const forgotPasswordService = async (t: TFunction, email: string) => {
  // Check if the user exists, if not, throw an error
  const user = await getUserByEmail(email);
  if (!user) throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND, t('user_not_found', { ns: 'error' }));

  const timeAgo = threeMinutesAgo(); // 3 minutes ago
  const maxAttempts = 2; // No. of emails allowed to be sent

  // Count the number of password reset emails sent to the user in the last 3 minutes
  const emailSentCount = await countVerificationTokens(user.id, VERIFICATION_TYPES.PASSWORD_RESET, timeAgo);

  // If the user has sent more than 2 password reset emails in the last 3 minutes, throw an error
  // This is to prevent spamming the email with password reset requests
  if (emailSentCount >= maxAttempts)
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.TOO_MANY_REQUESTS, t('too_many_requests', { ns: 'error' }));

  // Generate a new password reset token, valid for 1 hour
  const expiresAt = anHourFromNow();
  const validToken = await generateVerificationTokenForPasswordReset({ userId: user.id, type: VERIFICATION_TYPES.PASSWORD_RESET, expiresAt });

  // Send the password reset email to the user, including the reset link with the token and expiration time
  const resetLink = `${env.app.CLIENT_URL}/reset-password?token=${validToken.token}&exp=${expiresAt.getTime()}`;
  const emailResponse = await sendEmail({ t, to: user.email, ...passwordResetTemplate(resetLink) });

  // Return the email response
  return { url: resetLink, id: emailResponse?.id };
};
