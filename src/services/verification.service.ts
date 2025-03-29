import type { VerificationToken } from '@prisma/client';

import type { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { generateUniqueCode } from '@/utils/uuid';

import prisma from '@/database/prisma-client';

interface GenerateVerificationTokenPayload {
  userId: string;
  token?: string;
  expiresAt: Date;
  type: VERIFICATION_TYPES;
}

/**
 * Creates a verification token in the database.
 * @param {GenerateVerificationTokenPayload} payload - The payload containing the verification token details.
 * @param {string} payload.userId - The ID of the user associated with the verification token.
 * @param {string} payload.token - The verification token.
 * @param {Date} payload.expiresAt - The expiration date and time of the verification token.
 * @param {VERIFICATION_TYPES} payload.type - The type of verification (e.g., email, phone).
 * @returns {Promise<VerificationToken>} - The created verification token object.
 */
export const generateVerificationToken = async (payload: GenerateVerificationTokenPayload): Promise<VerificationToken> => {
  const token = payload.token || generateUniqueCode();

  // Check if a verification token already exists for the user
  const existingToken = await prisma.verificationToken.findFirst({ where: { userId: payload.userId, type: payload.type } });

  // If a verification token already exists, delete it
  if (existingToken) await prisma.verificationToken.delete({ where: { id: existingToken.id } });

  return await prisma.verificationToken.create({ data: { token, ...payload } });
};
