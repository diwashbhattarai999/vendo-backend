import * as z from 'zod';

import { verificationCodeSchema } from '../common.schema';

/**
 * Schema for verifying email.
 * This schema validates the structure and types of the data required for email verification.
 * It includes a field for the verification code.
 */
export const verifyEmailSchema = z.object({
  body: z.object({ verificationCode: verificationCodeSchema }).strict(),
});

/**
 * Type for verifying email.
 * This type is derived from the verifyEmailSchema and represents the expected structure of the data.
 */
export type VerifyEmailType = z.infer<typeof verifyEmailSchema>['body'];
