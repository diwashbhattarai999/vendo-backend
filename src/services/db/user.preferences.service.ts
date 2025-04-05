import type { UserPreferences } from '@prisma/client';

import prisma from '@/database/prisma-client';

/**
 * Fetch user preferences by user ID.
 */
export const updateUserPreferences = async (userId: string, preferences: Partial<UserPreferences>) => {
  return await prisma.userPreferences.upsert({
    where: { userId },
    update: preferences,
    create: { userId, ...preferences },
  });
};
