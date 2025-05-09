import { AccountType, Provider, type User } from '@prisma/client';

import prisma from '@/database/prisma-client';

/**
 * Fetch a user by their email address.
 */
export const getUserByEmail = async (email: string) =>
  await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { userPreferences: true },
  });

/**
 * Fetch a user by their ID.
 */
export const getUserById = async (userId: string) =>
  await prisma.user.findUnique({
    where: { id: userId },
    include: { userPreferences: true },
  });

/**
 * Fetch a user by their ID and include their sessions.
 */
export const createUser = async (userData: { email: string; password: string; firstName: string; lastName: string }): Promise<User> => {
  return await prisma.user.create({
    data: {
      ...userData,
      email: userData.email.toLowerCase(),
      accounts: {
        create: {
          provider: Provider.EMAIL,
          providerAccountId: userData.email,
          type: AccountType.EMAIL,
        },
      },
    },
  });
};

/**
 * Fetch a user by their ID and include their sessions.
 */
export const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
  return await prisma.user.update({ where: { id: userId }, data });
};

export const createOauthUser = async (payload: {
  email: string;
  isEmailVerified: boolean;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  providerAccountId: string;
  accessToken: string;
  refreshToken: string;
  provider: Provider;
}) => {
  const { email, firstName, lastName, profilePictureUrl, providerAccountId, accessToken, refreshToken, isEmailVerified, provider } = payload;

  return await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      isEmailVerified,
      profilePictureUrl,
      accounts: {
        create: {
          provider,
          providerAccountId,
          type: AccountType.OAUTH,
          accessToken,
          refreshToken,
        },
      },
    },
    include: { userPreferences: true },
  });
};

export const deleteUser = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } });
};
