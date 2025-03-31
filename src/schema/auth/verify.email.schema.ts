import * as z from 'zod';

import { verificationTokenSchema } from '../common.schema';

/**
 * Schema for verifying email.
 * This schema validates the structure and types of the data required for email verification.
 * It includes a field for the verification token.
 */
export const verifyEmailSchema = z.object({
  body: z.object({ verificationToken: verificationTokenSchema }).strict(),
});

/**
 * Type for verifying email.
 * This type is derived from the verifyEmailSchema and represents the expected structure of the data.
 */
export type VerifyEmailType = z.infer<typeof verifyEmailSchema>;
