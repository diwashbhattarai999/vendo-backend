import type { User } from '@prisma/client';
import type { TFunction } from 'i18next';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';
import { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { CustomError } from '@/error/custom.api.error';

import { hashValue } from '@/utils/bcrypt';
import { fortyFiveMinutesFromNow } from '@/utils/date.time';

import type { RegisterType } from '@/schema/auth/register.schema';

import { createUser, getUserByEmail } from '../user.service';
import { generateVerificationToken } from '../verification.service';

import { sendEmail } from '@/mailers/mailer';
import { verifyEmailTemplate } from '@/mailers/templates/verify.email.template';

/**
 * Service to handle user registration.
 * This function checks if the user already exists in the database,
 * hashes the password, and creates a new user.
 *
 * @param {Request} req - The request object containing user registration data.
 * @returns {Promise<RegisterType['body']>} - The newly created user data without the password.
 */
export const registerService = async (t: TFunction, payload: RegisterType['body']): Promise<Omit<User, 'password'>> => {
  const { email, password, firstName, lastName } = payload;

  // Check if email already exists in the database
  const existingUser = await getUserByEmail(email);

  // If the user already exists, throw a custom error
  if (existingUser)
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.AUTH_EMAIL_ALREADY_EXISTS, t('register.user_with_email_exists', { ns: 'auth' }));

  // Hash the password
  const hashedPassword = await hashValue(password);

  // Create a new user in the database
  const newUser = await createUser({ email, password: hashedPassword, firstName, lastName });

  // Create a verification code for the new user
  const verification = await generateVerificationToken({
    userId: newUser.id,
    expiresAt: fortyFiveMinutesFromNow(),
    type: VERIFICATION_TYPES.EMAIL_VERIFICATION,
  });

  // Send a verification email to the user
  const verificationUrl = `${env.app.CLIENT_URL}/confirm-account?token=${verification.token}`;
  await sendEmail({
    to: newUser.email,
    from: `Vendo <onboarding@${env.resend.RESEND_DOMAIN}>`,
    ...verifyEmailTemplate({
      name: `${newUser.firstName} ${newUser.lastName}`,
      url: verificationUrl,
    }),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- We need to remove the password from the response
  const { password: _, ...sanitizedUser } = newUser;

  return sanitizedUser;
};
