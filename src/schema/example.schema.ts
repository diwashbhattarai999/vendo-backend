import { z } from 'zod';

/**
 * Schema for sending an email.
 */
export const sendEmailSchema = z.object({
  body: z.object({
    to: z.string({ required_error: 'to (receiver) is required' }).email(),
    dynamicTemplateData: z.record(z.any()),
  }),
});

/**
 * Type derived from `sendEmailSchema`.
 */
export type SendEmailType = z.infer<typeof sendEmailSchema>;

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
