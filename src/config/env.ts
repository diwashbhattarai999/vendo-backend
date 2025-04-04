import dotenvFlow from 'dotenv-flow';

import { envSchema } from '@/schema/env.schema';

import { logger } from '@/logger/winston.logger';

dotenvFlow.config();

/**
 * Load environment variables from .env files
 * and validate them using Zod schema.
 */
const parsedEnv = envSchema.safeParse({
  app: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    LOG_LEVEL: process.env.LOG_LEVEL,
    BASE_URL: `${process.env.BASE_URL}/api/v0`,
    CLIENT_URL: process.env.CLIENT_URL,
    API_KEY: process.env.API_KEY,
    DISABLE_RATE_LIMITER: process.env.DISABLE_RATE_LIMITER,
    DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT: process.env.DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT,
  },
  resend: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_DOMAIN: process.env.RESEND_DOMAIN,
  },
  jwt: {
    ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  },
});

/**
 * Check if the environment variables are valid
 * If not, log the error and exit the process
 */
if (!parsedEnv.success) {
  logger.error('Environment variables validation error:', parsedEnv.error);
  process.exit(1);
}

/**
 * Export the validated environment variables
 * to be used throughout the application.
 */
export const env = parsedEnv.data;
