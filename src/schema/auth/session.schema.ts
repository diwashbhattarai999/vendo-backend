import * as z from 'zod';

export const deleteSessionSchema = z.object({
  params: z
    .object({
      sessionId: z.string().min(1, { message: 'Session ID is required' }),
    })
    .strict(),
});

export type DeleteSessionType = z.infer<typeof deleteSessionSchema>;
