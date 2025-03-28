import { env } from '@/config/env';

import { EApplicationEnvironment } from '@/constant/application';

/**
 * This function will check if the application is in development environment.
 *
 * @returns: boolean
 */
export const isDevelopment = env.app.NODE_ENV === EApplicationEnvironment.DEVELOPMENT;

/**
 * This function will check if the application is in production environment.
 *
 * @returns: boolean
 */
export const isProduction = env.app.NODE_ENV === EApplicationEnvironment.PRODUCTION;
