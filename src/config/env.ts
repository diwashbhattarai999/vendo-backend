import dotenvFlow from 'dotenv-flow';

import { logger } from '@/services/winston.logger';

import { envSchema } from '@/schema/env.schema';

dotenvFlow.config();

const parsedEnv = envSchema.safeParse({
  app: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    LOG_LEVEL: process.env.LOG_LEVEL,
    CLIENT_URL: process.env.CLIENT_URL,
    API_KEY: process.env.API_KEY,
    DISABLE_RATE_LIMITER: process.env.DISABLE_RATE_LIMITER,
    DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT: process.env.DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT,
  },

  firebase: {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_DATABASE_ID: process.env.FIREBASE_DATABASE_ID,
  },

  twilio: {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_SERVICE_SID: process.env.TWILIO_SERVICE_SID,
  },

  sendgrid: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
  },

  template: {
    TEMPLATE_WELCOME: process.env.TEMPLATE_WELCOME,
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

export const env = parsedEnv.data;
