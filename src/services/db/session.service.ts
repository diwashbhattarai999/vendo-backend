import { thirtyDaysFromNow } from '@/utils/date.time';

import prisma from '@/database/prisma-client';

/**
 * Gets a session by ID (without user join).
 */
export const getSessionById = async (sessionId: string) => {
  return await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: { select: { id: true, role: true } } },
  });
};

/**
 * Fetches a session by its ID.
 */
export const getSessionUserById = async (sessionId: string) => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId, expiresAt: { gt: new Date() } },
    select: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return session?.user;
};

/**
 * Fetches all sessions associated with a given user ID.
 */
export const getAllSessionsByUserId = async (userId: string) => {
  return await prisma.session.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    select: { id: true, userId: true, userAgent: true, createdAt: true, expiresAt: true },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Creates a new session for a user.
 */
export const createSession = async (userId: string, userAgent?: string, expiresAt?: Date) => {
  return await prisma.session.create({
    data: {
      userId: userId,
      userAgent,
      expiresAt: expiresAt || thirtyDaysFromNow(),
    },
  });
};

/**
 * Updates session expiration date.
 */
export const updateSessionExpiration = async (sessionId: string, expiresAt: Date) => {
  return await prisma.session.update({
    where: { id: sessionId },
    data: { expiresAt },
  });
};

/**
 * Deletes all sessions associated with a given user ID.
 */
export const deleteAllSessionsByUserId = async (userId: string) => await prisma.session.deleteMany({ where: { userId } });

/**
 * Deletes a session by its ID.
 */
export const deleteSessionById = async (sessionId: string) => await prisma.session.delete({ where: { id: sessionId } });

/**
 * Deletes a session by its ID and user ID.
 */
export const deleteSessionByIdAndUserId = async (sessionId: string, userId: string) =>
  await prisma.session.delete({ where: { id: sessionId, userId } });
