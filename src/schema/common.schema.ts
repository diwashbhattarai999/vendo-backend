import * as z from 'zod';

/**
 * Schema for validating email addresses.
 * This schema checks if the provided email is a valid format and meets length requirements.
 */
export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .trim()
  .email({ message: 'Invalid email address' })
  .min(1, { message: 'Email cannot be empty' })
  .max(255, { message: 'Email must be at most 255 characters long' });

/**
 * Schema for validating passwords.
 * This schema checks if the provided password meets complexity requirements, including length and character types.
 */
export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .trim()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(32, { message: 'Password must be at most 32 characters long' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character' });

/**
 * Schema for validating verification codes.
 */
export const verificationCodeSchema = z
  .string({ required_error: 'Verification code is required' })
  .trim()
  .min(1, { message: 'Verification code cannot be empty' })
  .max(32, { message: 'Verification code must be at most 32 characters long' });
