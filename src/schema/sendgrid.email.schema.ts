import { z } from 'zod';

/**
 * Schema for validating Twilio SendGrid email sending data.
 * This schema ensures the presence of required fields and validates their types.
 *
 * @example
 * {
 *   to: 'example@domain.com',
 *   templateId: 'your-template-id',
 *   dynamicTemplateData: { key: 'value' }
 * }
 */
export const sendgridEmailSchema = z.object({
  /**
   * The recipient's email address. Must be a valid email format.
   * @type {string}
   */
  to: z.string({ required_error: 'Recipient email (to) is required' }).email(),

  /**
   * The unique identifier for the email template to be used.
   * @type {string}
   */
  templateId: z.string({ required_error: 'Template ID is required' }),

  /**
   * A dynamic set of template data to personalize the email content.
   * @type {Record<string, any>}
   */
  dynamicTemplateData: z.record(z.any()),
});

/**
 * Type definition inferred from the sendgridEmailSchema.
 * Ensures that the data passed adheres to the validated structure.
 */
export type SendGridEmailType = z.infer<typeof sendgridEmailSchema>;
