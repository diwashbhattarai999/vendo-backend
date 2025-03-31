import * as z from 'zod';

import { emailSchema } from '../common.schema';

/**
 * Schema for forgot password.
 * This schema validates the structure and types of the data required for password reset.
 * It includes a field for the user's email address.
 */
export const forgotPasswordSchema = z.object({
  body: z.object({ email: emailSchema }),
});

/**
 * Type for forgot password.
 * This type is derived from the forgotPasswordSchema and represents the expected structure of the data.
 */
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>['body'];
