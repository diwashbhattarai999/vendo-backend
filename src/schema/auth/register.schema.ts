import * as z from 'zod';

import { emailSchema, passwordSchema } from '../common.schema';

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
      confirmPassword: passwordSchema,
      firstName: z.string({ required_error: 'First name is required' }).min(1, { message: 'First name is too short' }),
      lastName: z.string({ required_error: 'Last name is required' }).min(1, { message: 'Last name is too short' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

export type RegisterType = z.infer<typeof registerSchema>;
