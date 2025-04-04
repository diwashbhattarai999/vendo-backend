import * as z from 'zod';

import { emailSchema } from '../common.schema';

/**
 * Schema for verifying MFA setup.
 * This schema validates the structure and types of the data required for MFA setup verification.
 * It includes fields for OTP code and secret key.
 */
export const verifyMfaSetupSchema = z.object({
  body: z
    .object({
      otpCode: z.string().trim().length(6, 'otpCode must be exactly 6 characters long'),
      secretKey: z.string().trim().min(1, { message: 'secretKey is required' }),
    })
    .strict(),
});

/**
 * Schema for verifying MFA during login.
 * This schema validates the structure and types of the data required for MFA verification during login.
 * It includes fields for OTP code and email.
 */
export const verifyMfaForLoginSchema = z.object({
  body: z.object({
    otpCode: z.string().trim().length(6, 'otpCode must be exactly 6 characters long'),
    email: emailSchema,
  }),
});

/**
 * Type for verifying MFA setup.
 * This type is derived from the verifyMfaSetupSchema and represents the expected structure of the data.
 */
export type VerifyMfaSetupType = z.infer<typeof verifyMfaSetupSchema>;

/**
 * Type for verifying MFA during login.
 * This type is derived from the verifyMfaForLoginSchema and represents the expected structure of the data.
 */
export type VerifyMfaForLoginType = z.infer<typeof verifyMfaForLoginSchema>;
