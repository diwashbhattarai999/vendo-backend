import type { TFunction } from 'i18next';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';
import { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { CustomError } from '@/error/custom.api.error';

import { fortyFiveMinutesFromNow } from '@/utils/date.time';
import { checkTooManyVerificationEmails } from '@/utils/email.rate.limit';

import { getUserByEmail } from '../db/user.service';
import { generateVerificationToken } from '../db/verification.service';

import { logger } from '@/logger/winston.logger';
import { sendEmail } from '@/mailers/mailer';
import { verifyEmailTemplate } from '@/mailers/templates/verify.email.template';

/**
 * Service to resend email verification.
 * It checks if the user exists, verifies if the email is already verified,
 * and sends a new verification email if necessary.
 */
export const resendEmailVerificationService = async (t: TFunction, email: string) => {
  const user = await getUserByEmail(email);
  if (!user) throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND, t('user.not_found'));

  // Check if the user's email is already verified
  if (user.isEmailVerified) {
    logger.warn(`User with email ${email} is already verified.`);
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.EMAIL_ALREADY_VERIFIED, t('email.already_verified', { ns: 'auth' }));
  }

  // Check if the user is active, if not, throw an error
  if (!user?.isActive) {
    logger.warn(`Login failed: User account is deactivated for email: ${email}`);
    throw new CustomError(STATUS_CODES.FORBIDDEN, ERROR_CODES.ACCOUNT_DEACTIVATED, t('user.account_deactivated'));
  }

  // Check if the user has exceeded the maximum number of verification emails
  await checkTooManyVerificationEmails({
    t,
    type: VERIFICATION_TYPES.EMAIL_VERIFICATION,
    userId: user.id,
  });

  // Generate a new verification token
  const verification = await generateVerificationToken({
    userId: user.id,
    expiresAt: fortyFiveMinutesFromNow(),
    type: VERIFICATION_TYPES.EMAIL_VERIFICATION,
  });

  // Send the verification email
  const verificationUrl = `${env.app.CLIENT_URL}/confirm-account?token=${verification.token}`;
  await sendEmail({
    t,
    to: user.email,
    from: `${env.app.APP_NAME} <onboarding@${env.resend.RESEND_DOMAIN}>`,
    ...verifyEmailTemplate({
      name: `${user.firstName} ${user.lastName}`,
      url: verificationUrl,
    }),
  });
};
