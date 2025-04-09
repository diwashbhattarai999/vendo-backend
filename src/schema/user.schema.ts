import * as z from 'zod';

import { confirmPasswordSchema, passwordSchema } from './common.schema';

export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;

export const changePasswordSchema = z.object({
  body: z
    .object({
      oldPassword: passwordSchema,
      newPassword: confirmPasswordSchema,
      confirmPassword: confirmPasswordSchema,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
    }),
});

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;
