import * as z from 'zod';

import { emailSchema } from '../common.schema';

export const verifyMfaSetupSchema = z.object({
  body: z
    .object({
      otpCode: z.string().trim().length(6, 'otpCode must be exactly 6 characters long'),
      secretKey: z.string().trim().min(1, { message: 'secretKey is required' }),
    })
    .strict(),
});

export const verifyMfaForLoginSchema = z.object({
  body: z.object({
    otpCode: z.string().trim().length(6, 'otpCode must be exactly 6 characters long'),
    email: emailSchema,
  }),
});

export type VerifyMfaSetupType = z.infer<typeof verifyMfaSetupSchema>;
export type VerifyMfaForLoginType = z.infer<typeof verifyMfaForLoginSchema>;
