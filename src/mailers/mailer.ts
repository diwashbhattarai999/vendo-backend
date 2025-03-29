import type { CreateEmailResponseSuccess } from 'resend';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { resend } from './resend.client';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  from?: string;
}

const FROM_EMAIL = `support@${env.resend.RESEND_DOMAIN}`;

/**
 * Function to send an email using Resend API.
 * @param {SendEmailParams} params - The parameters for sending the email.
 * @param {string | string[]} params.to - The recipient email address(es).
 * @param {string} params.subject - The subject of the email.
 * @param {string} params.text - The plain text content of the email.
 * @param {string} params.html - The HTML content of the email.
 * @param {string} [params.from] - The sender email address (optional, defaults to FROM_EMAIL).
 * @returns {Promise<CreateEmailResponseSuccess | null>} - The response from the Resend API or null if an error occurs.
 */
export const sendEmail = async ({ to, from = FROM_EMAIL, subject, text, html }: SendEmailParams): Promise<CreateEmailResponseSuccess | null> => {
  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    text,
    subject,
    html,
  });

  if (error) throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_CODES.EMAIL_SENDING_FAILED, 'Failed to send email');

  return data;
};
