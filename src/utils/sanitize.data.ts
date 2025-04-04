import type { User } from '@prisma/client';

import type { UserWithUserPreferences } from '@/types/user';

/**
 * Removes sensitive fields (e.g., password) from a user object.
 *
 * This function is used to sanitize user data before sending it to the client
 * or exposing it in logs to ensure sensitive information is not leaked.
 *
 * @param {User | UserWithUserPreferences} user - The user object to sanitize.
 * @returns {Omit<User | UserWithUserPreferences, 'password'>} The sanitized user object without the `password` field.
 */
export const sanitizeUser = (user: User | UserWithUserPreferences): Omit<User | UserWithUserPreferences, 'password'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Destructure the `password` field and exclude it from the returned object
  const { password, ...sanitizedUser } = user;

  // Return the sanitized user object
  return sanitizedUser;
};
