import { Resend } from 'resend';

import { env } from '@/config/env';

/**
 * Resend client instance for sending emails.
 * This instance is created using the Resend API key from the environment variables.
 * It is used to send emails using the Resend service.
 * @see https://resend.com/docs
 */
export const resend = new Resend(env.resend.RESEND_API_KEY);
