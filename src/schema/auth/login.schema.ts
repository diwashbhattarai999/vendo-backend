import * as z from 'zod';

import { emailSchema, passwordSchema } from '../common.schema';

export const loginSchema = z.object({
  body: z
    .object({
      email: emailSchema,
      password: passwordSchema,
    })
    .strict(),
});

export type LoginType = z.infer<typeof loginSchema>;
