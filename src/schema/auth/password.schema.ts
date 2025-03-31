import * as z from 'zod';

import { confirmPasswordSchema, emailSchema, passwordSchema, verificationTokenSchema } from '../common.schema';

/**
 * Schema for forgot password.
 * This schema validates the structure and types of the data required for password reset.
 * It includes a field for the user's email address.
 */
export const forgotPasswordSchema = z.object({
  body: z.object({ email: emailSchema }),
});

/**
 * Schema for reset password.
 * This schema validates the structure and types of the data required for resetting a password.
 * It includes fields for the new password and its confirmation.
 */
export const resetPasswordSchema = z.object({
  body: z
    .object({
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema,
      verificationToken: verificationTokenSchema,
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

/**
 * Type for forgot password.
 * This type is derived from the forgotPasswordSchema and represents the expected structure of the data.
 */
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

/**
 * Type for reset password.
 * This type is derived from the resetPasswordSchema and represents the expected structure of the data.
 */
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
