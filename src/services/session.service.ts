import { thirtyDaysFromNow } from '@/utils/date.time';

import prisma from '@/database/prisma-client';

export const deleteSessionByUserId = async (userId: string) => await prisma.session.deleteMany({ where: { userId } });

export const deleteSessionById = async (sessionId: string) => await prisma.session.delete({ where: { id: sessionId } });

export const deleteSessionByIdAndUserId = async (sessionId: string, userId: string) =>
  await prisma.session.delete({ where: { id: sessionId, userId } });

export const getAllSessionsByUserId = async (userId: string) => {
  return await prisma.session.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    select: { id: true, userId: true, userAgent: true, createdAt: true, expiresAt: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const getSessionById = async (sessionId: string) => {
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

export const createSession = async (userId: string, userAgent?: string, expiresAt?: Date) => {
  return await prisma.session.create({
    data: {
      userId: userId,
      userAgent,
      expiresAt: expiresAt || thirtyDaysFromNow(),
    },
  });
};
