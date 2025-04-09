import type { Provider } from '@prisma/client';
import type { TFunction } from 'i18next';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { sanitizeUser } from '@/utils/sanitize.data';

import { getAccountByEmail, getAccountByProvider } from '../db/account.service';
import { createOauthUser } from '../db/user.service';

interface LoginOrCreateAccountType {
  t: TFunction;
  provider: Provider;
  providerId: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  email: string;
  emailVerified: boolean;
  accessToken: string;
  refreshToken: string;
}

export const loginOrCreateAccountService = async (data: LoginOrCreateAccountType) => {
  const { t, provider, providerId, firstName, lastName, profilePictureUrl, email, emailVerified, accessToken, refreshToken } = data;

  // Check if the email is already registered with different provider
  const existingUser = await getAccountByEmail(email);
  if (existingUser && existingUser.provider !== provider) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      ERROR_CODES.AUTH_EMAIL_ALREADY_REGISTERED_WITH_DIFFERENT_PROVIDER,
      t('email_already_registered_with_different_provider', { ns: 'auth' }),
    );
  }

  // Check if the account already exists
  const existingAccount = await getAccountByProvider(provider, providerId);
  if (existingAccount) return { user: existingAccount.user };

  // Create a new user and account
  const newUser = await createOauthUser({
    firstName,
    lastName,
    profilePictureUrl,
    email,
    isEmailVerified: emailVerified,
    accessToken,
    providerAccountId: providerId,
    refreshToken,
    provider,
  });

  return { user: sanitizeUser(newUser) };
};
