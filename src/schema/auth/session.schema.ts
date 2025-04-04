import * as z from 'zod';

/**
 * Schema for creating a session.
 * This schema validates the structure and types of the data required for creating a session.
 * It includes fields for the user ID, device ID, and IP address.
 */
export const deleteSessionSchema = z.object({
  params: z
    .object({
      sessionId: z.string().min(1, { message: 'Session ID is required' }),
    })
    .strict(),
});

/**
 * Type for creating a session.
 * This type is derived from the deleteSessionSchema and represents the expected structure of the data.
 */
export type DeleteSessionType = z.infer<typeof deleteSessionSchema>;
