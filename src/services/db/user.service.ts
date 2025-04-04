import type { User } from '@prisma/client';

import prisma from '@/database/prisma-client';

/**
 * Fetch a user by their email address.
 */
export const getUserByEmail = async (email: string) =>
  await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isEmailVerified: true,
      password: true,
      createdAt: true,
      updatedAt: true,
      userPreferences: true,
    },
  });

/**
 * Fetch a user by their ID.
 */
export const getUserById = async (userId: string) =>
  await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isEmailVerified: true,
      password: true,
      createdAt: true,
      updatedAt: true,
      userPreferences: true,
    },
  });

/**
 * Fetch a user by their ID and include their sessions.
 */
export const createUser = async (userData: { email: string; password: string; firstName: string; lastName: string }): Promise<User> => {
  return await prisma.user.create({ data: { ...userData, email: userData.email.toLowerCase() } });
};

/**
 * Fetch a user by their ID and include their sessions.
 */
export const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
  return await prisma.user.update({ where: { id: userId }, data });
};
