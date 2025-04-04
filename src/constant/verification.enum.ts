/**
 * This file contains the enum for verification types.
 * It defines the different types of verifications that can be performed in the application.
 *
 * The verification types are:
 * - EMAIL_VERIFICATION: Verification for email addresses.
 * - PASSWORD_RESET: Verification for password reset requests.
 */
export enum VERIFICATION_TYPES {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export type TVerificationTypes = keyof typeof VERIFICATION_TYPES;
