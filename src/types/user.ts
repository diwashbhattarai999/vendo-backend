import type { User, UserPreferences } from '@prisma/client';

export type UserWithUserPreferences = User & {
  userPreferences: UserPreferences;
};
