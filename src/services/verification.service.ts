import type { Prisma, VerificationToken } from '@prisma/client';

import type { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { anHourFromNow } from '@/utils/date.time';
import { generateUniqueCode } from '@/utils/uuid';

import prisma from '@/database/prisma-client';

type VerificationPayload = {
  userId: string;
  type: VERIFICATION_TYPES;
  expiresAt?: Date;
};

export const generateVerificationToken = async (payload: VerificationPayload): Promise<VerificationToken> => {
  const { userId, type, expiresAt = anHourFromNow() } = payload;

  // Generate a unique token
  const token = generateUniqueCode();

  // Create a new verification token in the database
  return await prisma.verificationToken.create({ data: { userId, token, expiresAt, type } });
};

export const generateVerificationTokenForEmail = async (payload: VerificationPayload): Promise<VerificationToken> => {
  // Check if a verification token already exists for the user
  const existingToken = await prisma.verificationToken.findFirst({ where: { userId: payload.userId, type: payload.type } });

  // If a verification token already exists, delete it
  if (existingToken) await prisma.verificationToken.delete({ where: { id: existingToken.id } });

  // Generate aand return a new verification token
  return await generateVerificationToken({ ...payload });
};

export const findVerificationToken = async (
  token: string,
  type: VERIFICATION_TYPES,
  options: Prisma.DateTimeFilter = { gte: new Date() },
): Promise<VerificationToken | null> => {
  return await prisma.verificationToken.findFirst({ where: { token, type, expiresAt: options } });
};

export const deleteVerificationToken = async (token: string, type: VERIFICATION_TYPES, userId: string): Promise<VerificationToken | null> => {
  return await prisma.verificationToken.delete({ where: { token, type, userId } });
};

export const countVerificationTokens = async (userId: string, type: VERIFICATION_TYPES, timeAgo: Date): Promise<number> => {
  return await prisma.verificationToken.count({ where: { userId, type, expiresAt: { gte: timeAgo } } });
};
