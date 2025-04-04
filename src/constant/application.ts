/**
 * This file contains the enum for the application environment.
 * It defines the different environments in which the application can run.
 *
 * The environments are:
 * - PRODUCTION: The production environment where the application is live.
 * - DEVELOPMENT: The development environment where the application is being developed.
 * - STAGING: The staging environment where the application is tested before going live.
 * - TEST: The test environment where the application is tested.
 */
export enum EApplicationEnvironment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  TEST = 'test',
}
