import * as z from 'zod';

import { confirmPasswordSchema, emailSchema, passwordSchema } from '../common.schema';

/**
 * Schema for user registration data.
 * This schema validates the structure and types of the data required for user registration.
 * It includes fields for email, password, first name, last name, and phone number.
 */
export const registerSchema = z.object({
  body: z
    .object({
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema,
      firstName: z.string({ required_error: 'First name is required' }).min(1, { message: 'First name is too short' }),
      lastName: z.string({ required_error: 'Last name is required' }).min(1, { message: 'Last name is too short' }),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

/**
 * Type for user registration data.
 * This type is derived from the registerSchema and represents the expected structure of the data.
 */
export type RegisterType = z.infer<typeof registerSchema>;
