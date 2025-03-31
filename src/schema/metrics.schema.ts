import * as z from 'zod';

/**
 * Schema for metrics data.
 * This schema validates the structure and types of the data required for metrics.
 * It includes a field for the loop parameter.
 */
export const metricsSchema = z.object({
  query: z.object({
    loop: z.string().default('0'),
  }),
});

/**
 * Type for metrics data.
 * This type is derived from the metricsSchema and represents the expected structure of the data.
 */
export type MetricsType = z.infer<typeof metricsSchema>;
