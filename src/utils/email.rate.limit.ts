import type { TFunction } from 'i18next';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';
import type { VERIFICATION_TYPES } from '@/constant/verification.enum';

import { CustomError } from '@/error/custom.api.error';

import { countVerificationTokens } from '@/services/db/verification.service';

import { threeMinutesAgo } from './date.time';

import { logger } from '@/logger/winston.logger';

interface CheckTooManyVerificationEmailsPayload {
  userId: string;
  type: VERIFICATION_TYPES;
  timeAgo?: Date;
  maxAttempts?: number;
  t: TFunction;
}

/**
 * Checks if too many verification emails have been sent within a specific time frame.
 * If the limit is exceeded, it throws a CustomError with a 429 status code.
 */
export const checkTooManyVerificationEmails = async (payload: CheckTooManyVerificationEmailsPayload): Promise<void> => {
  const { t, userId, type, timeAgo = threeMinutesAgo(), maxAttempts = 2 } = payload;

  // Count the number of emails sent to the user in the last 3 minutes
  const emailSentCount = await countVerificationTokens(userId, type, timeAgo);

  // If the user has sent more than 2 emails in the last 3 minutes, throw an error
  // This is to prevent spamming the email with password reset requests
  if (emailSentCount >= maxAttempts) {
    logger.warn(`Too many verification emails sent. User ID: ${userId}`);
    throw new CustomError(STATUS_CODES.TOO_MANY_REQUESTS, ERROR_CODES.TOO_MANY_REQUESTS, t('too_many_requests', { ns: 'error' }));
  }
};
