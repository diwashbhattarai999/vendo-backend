import type { User } from '@prisma/client';

import prisma from '@/database/prisma-client';

/**
 * Function to get a user by email.
 * @param {string} email - The email address of the user to retrieve.
 * @returns {Promise<User | null>} - The user object if found, otherwise null.
 */
export const getUserByEmail = async (email: string): Promise<User | null> => await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

/**
 * Function to create a new user.
 * @param {Object} userData - The data of the user to create.
 * @param {string} userData.email - The email address of the user.
 * @param {string} userData.password - The password of the user.
 * @param {string} userData.firstName - The first name of the user.
 * @param {string} userData.lastName - The last name of the user.
 * @returns {Promise<User>} - The created user object.
 */
export const createUser = async (userData: { email: string; password: string; firstName: string; lastName: string }): Promise<User> => {
  return await prisma.user.create({ data: { ...userData, email: userData.email.toLowerCase() } });
};

export const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
  return await prisma.user.update({ where: { id: userId }, data });
};
