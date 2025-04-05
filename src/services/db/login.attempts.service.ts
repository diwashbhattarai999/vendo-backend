import prisma from '@/database/prisma-client';

export const getLoginAttemptByIp = async (ip: string) => {
  return prisma.loginAttempt.findFirst({ where: { ipAddress: ip } });
};

type CreateLoginAttemptPayload = {
  ipAddress: string;
  userAgent?: string;
};

export const createLoginAttempt = async (payload: CreateLoginAttemptPayload) => {
  return prisma.loginAttempt.create({
    data: {
      userAgent: payload.userAgent,
      ipAddress: payload.ipAddress,
      attempts: 1,
    },
  });
};

type UpdateLoginAttemptPayload = {
  id: string;
  attempts: number;
  lastAttemptAt: Date;
  userAgent?: string;
  blockedUntil?: Date;
};

export const updateLoginAttempt = async (payload: UpdateLoginAttemptPayload) => {
  return prisma.loginAttempt.update({
    where: { id: payload.id },
    data: {
      attempts: payload.attempts,
      lastAttemptAt: payload.lastAttemptAt,
      userAgent: payload.userAgent,
      blockedUntil: payload.blockedUntil,
    },
  });
};

export const resetLoginAttempts = async (id: string) => {
  // return await prisma.loginAttempt.deleteMany({ where: { ipAddress } });
  return await prisma.loginAttempt.update({
    where: { id },
    data: {
      attempts: 0,
      lastAttemptAt: new Date(),
      blockedUntil: null,
    },
  });
};
