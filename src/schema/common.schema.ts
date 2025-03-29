import * as z from 'zod';

export const emailSchema = z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' });

export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character' });
