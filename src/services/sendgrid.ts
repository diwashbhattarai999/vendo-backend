import sgMail from '@sendgrid/mail';
import type { Request } from 'express';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { logger } from '@/services/winston.logger';

import type { SendGridEmailType } from '@/schema/sendgrid.email.schema';

sgMail.setApiKey(env.sendgrid.SENDGRID_API_KEY);

/**
 * @description Send email using SendGrid
 *
 * @param {Request} req - Express request object (used for translations)
 * @param {twiloSendgridType} payload - The email options
 * @param {string} payload.to - Recipient email address
 * @param {string} payload.templateId - SendGrid template ID
 * @param {object} payload.dynamicTemplateData - Dynamic data for the template
 *
 * @returns {Promise<void>}
 * @throws {CustomError} Throws an CustomError with translated messages if sending email fails
 *
 * @example
 * await sendEmail(req, {
 *   to: 'recipient@example.com',
 *   templateId: 'd-template-id-from-sendgrid',
 *   dynamicTemplateData: { name: 'John', resetLink: 'https://example.com/reset' }
 * });
 *
 * @see https://www.twilio.com/docs/sendgrid/for-developers/sending-email/quickstart-nodejs
 * @see https://app.sendgrid.com/guide
 */
export const sendEmail = async (req: Request, payload: SendGridEmailType) => {
  const t = req.t;
  try {
    return await sgMail.send({
      from: env.sendgrid.SENDGRID_FROM_EMAIL,
      to: payload.to,
      templateId: payload.templateId,
      dynamicTemplateData: payload.dynamicTemplateData,
    });
  } catch (error) {
    logger.error(error);
    throw new CustomError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_CODES.GENERAL_ERROR,
      t('email_not_sent_message', { ns: 'error' }),
      t('email_not_sent_details', { ns: 'error' }),
      t('email_not_sent_suggestion', { ns: 'error' }),
    );
  }
};
