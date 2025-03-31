import * as z from 'zod';

import { emailSchema, passwordSchema } from '../common.schema';

/**
 * Schema for user login data.
 * This schema validates the structure and types of the data required for user login.
 * It includes fields for email and password.
 */
export const loginSchema = z.object({
  body: z.object({ email: emailSchema, password: passwordSchema }).strict(),
});

/**
 * Type for user login data.
 * This type is derived from the loginSchema and represents the expected structure of the data.
 */
export type LoginType = z.infer<typeof loginSchema>;
