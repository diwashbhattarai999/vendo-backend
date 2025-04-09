import type { Account, Provider } from '@prisma/client';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import prisma from '@/database/prisma-client';
import { logger } from '@/logger/winston.logger';

export const getAccountByProvider = async (provider: Provider, providerId: string) => {
  try {
    return await prisma.account.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId: providerId } },
      include: { user: { include: { userPreferences: true } } },
    });
  } catch (error) {
    logger.error('Error fetching account:', error);
    throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_SERVER_ERROR, 'Error fetching account');
  }
};

export const getAccountByEmail = async (email: string) => {
  try {
    return await prisma.account.findFirst({
      where: { user: { email: email.toLowerCase() } },
      include: { user: { include: { userPreferences: true } } },
    });
  } catch (error) {
    logger.error('Error fetching account by email:', error);
    throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_SERVER_ERROR, 'Error fetching account by email');
  }
};

export const updateAccount = async (accountId: string, data: Partial<Account>) => {
  try {
    return await prisma.account.update({
      where: { id: accountId },
      data,
    });
  } catch (error) {
    logger.error('Error updating account:', error);
    throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_SERVER_ERROR, 'Error updating account');
  }
};
