import type { TFunction } from 'i18next';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';
import { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { CustomError } from '@/error/custom.api.error';

import { getResetPasswordUrl } from '@/utils/client.urls';
import { anHourFromNow } from '@/utils/date.time';
import { checkTooManyVerificationEmails } from '@/utils/email.rate.limit';

import { getUserByEmail } from '../db/user.service';
import { generateVerificationToken } from '../db/verification.service';

import { logger } from '@/logger/winston.logger';
import { sendEmail } from '@/mailers/mailer';
import { passwordResetTemplate } from '@/mailers/templates/password.reset.template';

/**
 * Service to handle the password reset process.
 * It checks if the user exists, counts the number of password reset emails sent in the last 3 minutes,
 * generates a new password reset token, and sends the password reset email to the user.
 */
export const forgotPasswordService = async (t: TFunction, email: string) => {
  logger.debug(`Initiating password reset flow for email: ${email}`);

  // Check if the user exists, if not, throw an error
  const user = await getUserByEmail(email);
  if (!user) {
    logger.warn(`Password reset failed: No user found for email: ${email}`);
    throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND, t('user_not_found', { ns: 'error' }));
  }

  // Check if the user is active, if not, throw an error
  if (!user?.isActive) throw new CustomError(STATUS_CODES.FORBIDDEN, ERROR_CODES.ACCOUNT_DEACTIVATED, t('user.account_deactivated'));

  // Check if the user has exceeded the maximum number of verification emails
  await checkTooManyVerificationEmails({ t, userId: user.id, type: VERIFICATION_TYPES.PASSWORD_RESET });

  // Generate a new password reset token, valid for 1 hour
  const expiresAt = anHourFromNow();
  const validToken = await generateVerificationToken({ userId: user.id, type: VERIFICATION_TYPES.PASSWORD_RESET, expiresAt });

  logger.info(`Password reset token created for user ID: ${user.id}`);

  // Send the password reset email to the user, including the reset link with the token and expiration time
  const resetLink = getResetPasswordUrl(validToken.token, expiresAt.getTime());
  const emailResponse = await sendEmail({ t, to: user.email, ...passwordResetTemplate(resetLink) });

  logger.info(`Password reset email dispatched to user ID: ${user.id}, email ID: ${emailResponse?.id}`);

  // Return the email response
  return { url: resetLink, id: emailResponse?.id };
};
