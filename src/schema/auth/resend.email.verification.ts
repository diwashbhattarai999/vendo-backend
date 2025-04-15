import * as z from 'zod';

/**
 * Schema for resending email verification.
 * This schema validates the structure and types of the data required to resend an email verification.
 * It includes a single field for the email address.
 */
export const resendEmailVerificationSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

/**
 * Type for resending email verification.
 * This type is derived from the resendEmailVerificationSchema and represents the expected structure of the data.
 */
export type ResendEmailVerificationType = z.infer<typeof resendEmailVerificationSchema>;
