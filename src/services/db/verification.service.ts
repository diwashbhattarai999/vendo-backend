import type { Prisma, VerificationToken } from '@prisma/client';

import type { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { anHourFromNow } from '@/utils/date.time';
import { generateUniqueToken } from '@/utils/uuid';

import prisma from '@/database/prisma-client';

/**
 * Payload type for generating a verification token.
 */
type VerificationPayload = {
  userId: string;
  type: VERIFICATION_TYPES;
  expiresAt?: Date;
};

/**
 * Generates a verification token for a user.
 * It creates a new verification token in the database with a unique token and an expiration time.
 */
export const generateVerificationToken = async (payload: VerificationPayload): Promise<VerificationToken> => {
  const { userId, type, expiresAt = anHourFromNow() } = payload;

  // If a expired verification token already exists, delete all expired tokens
  await prisma.verificationToken.deleteMany({ where: { userId, type, expiresAt: { lt: new Date() } } });

  // Generate a unique token
  const token = generateUniqueToken();

  // Create a new verification token in the database
  return await prisma.verificationToken.create({ data: { userId, token, expiresAt, type } });
};

/**
 * Finds a verification token for a user.
 * It searches for the token in the database based on the provided token, type, and expiration time.
 */
export const findVerificationToken = async (
  token: string,
  type: VERIFICATION_TYPES,
  options: Prisma.DateTimeFilter = { gte: new Date() },
): Promise<VerificationToken | null> => {
  return await prisma.verificationToken.findFirst({ where: { token, type, expiresAt: options } });
};

/**
 * Deletes a verification token for a user.
 * It removes the token from the database based on the provided token, type, and user ID.
 */
export const deleteVerificationToken = async (token: string, type: VERIFICATION_TYPES, userId: string): Promise<VerificationToken | null> => {
  return await prisma.verificationToken.delete({ where: { token, type, userId } });
};

/**
 * Deletes all expired verification tokens for a user.
 * It removes all tokens from the database that have expired.
 */
export const countVerificationTokens = async (userId: string, type: VERIFICATION_TYPES, timeAgo: Date): Promise<number> => {
  return await prisma.verificationToken.count({ where: { userId, type, createdAt: { gt: timeAgo } } });
};
