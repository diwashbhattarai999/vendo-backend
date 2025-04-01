import type { User } from '@prisma/client';

export const sanitizeUser = (user: User) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- We are intentionally removing the password from the user object
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};
