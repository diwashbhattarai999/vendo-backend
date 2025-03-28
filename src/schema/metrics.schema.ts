import * as z from 'zod';

/**
 * Schema for fetching metrics with query parameters.
 */
export const metricsSchema = z.object({
  query: z.object({
    loop: z.string().default('0'),
  }),
});

/**
 * Type derived from `metricsSchema`.
 */
export type MetricsType = z.infer<typeof metricsSchema>;
