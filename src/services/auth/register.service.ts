import type { TFunction } from 'i18next';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';
import { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { CustomError } from '@/error/custom.api.error';

import { hashValue } from '@/utils/bcrypt';
import { fortyFiveMinutesFromNow } from '@/utils/date.time';
import { sanitizeUser } from '@/utils/sanitize.data';

import type { RegisterType } from '@/schema/auth/register.schema';

import { createUser, getUserByEmail } from '../db/user.service';
import { generateVerificationTokenForEmail } from '../db/verification.service';

import { logger } from '@/logger/winston.logger';
import { sendEmail } from '@/mailers/mailer';
import { verifyEmailTemplate } from '@/mailers/templates/verify.email.template';

/**
 * Service to handle user registration.
 * It checks if the user already exists, hashes the password,
 * creates a new user, generates a verification token,
 * and sends a verification email to the user.
 */
export const registerService = async (t: TFunction, payload: RegisterType['body']) => {
  const { email, password, firstName, lastName } = payload;

  logger.debug(`Attempting registration for email: ${email}`);

  // Check if email already exists in the database
  const existingUser = await getUserByEmail(email);

  // If the user already exists, throw a custom error
  if (existingUser)
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.AUTH_EMAIL_ALREADY_EXISTS, t('register.user_with_email_exists', { ns: 'auth' }));

  // Hash the password
  const hashedPassword = await hashValue(password);
  logger.debug(`Password hashed for email: ${email}`);

  // Create a new user in the database
  const newUser = await createUser({ email, password: hashedPassword, firstName, lastName });
  logger.info(`New user created. ID: ${newUser.id}, Email: ${email}`);

  // Create a verification token for the new user
  const verification = await generateVerificationTokenForEmail({
    userId: newUser.id,
    expiresAt: fortyFiveMinutesFromNow(),
    type: VERIFICATION_TYPES.EMAIL_VERIFICATION,
  });
  logger.debug(`Verification token generated for user ID: ${newUser.id}`);

  // Send a verification email to the user
  const verificationUrl = `${env.app.CLIENT_URL}/confirm-account?token=${verification.token}`;
  await sendEmail({
    t,
    to: newUser.email,
    from: `${env.app.APP_NAME} <onboarding@${env.resend.RESEND_DOMAIN}>`,
    ...verifyEmailTemplate({
      name: `${newUser.firstName} ${newUser.lastName}`,
      url: verificationUrl,
    }),
  });
  logger.info(`Verification email sent to user ID: ${newUser.id}`);

  // Return the sanitized user data
  return sanitizeUser(newUser);
};
