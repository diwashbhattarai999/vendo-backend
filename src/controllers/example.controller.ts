import type { NextFunction, Request, Response } from 'express';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import type { RequestWithRateLimit } from '@/types/types';

import { asyncCatch } from '@/error/async.catch';
import { CustomError } from '@/error/custom.api.error';

import { sendHttpResponse } from '@/utils/send.http.response';

import { sendEmail } from '@/services/sendgrid';

import { DELAY_AFTER_REQUEST_COUNT, DELAY_AFTER_REQUEST_COUNT_EXCEEDED_IN_MS, WINDOW_IN_MILLISECONDS } from '@/middlewares/slow.down.api';

import type { MetricsType, SendEmailType } from '@/schema/example.schema';

/**
 * Handler to simulate API slow down based on the request count.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const slowDownExampleHandler = asyncCatch(async (req: RequestWithRateLimit, res: Response) => {
  const t = req.t;

  // Track the number of requests in the current window
  const requestCount = req.rateLimit?.current || 0;

  // Calculate expected delay based on our configuration
  let expectedDelay = 0;

  // If the request count exceeds the threshold, calculate the delay
  if (requestCount > DELAY_AFTER_REQUEST_COUNT) expectedDelay = requestCount * DELAY_AFTER_REQUEST_COUNT_EXCEEDED_IN_MS;

  // Calculate time remaining in the current window
  const resetTime = req.rateLimit?.resetTime || new Date(Date.now() + WINDOW_IN_MILLISECONDS);
  const timeRemaining = Math.max(0, resetTime.getTime() - Date.now());

  sendHttpResponse(res, STATUS_CODES.OK, t('api_slow_down_test'), {
    requestCount,
    expectedDelay: `${expectedDelay}ms`,
    timeBeforeReset: `${Math.floor(timeRemaining / 1000)} seconds`,
    delayStatus: requestCount <= DELAY_AFTER_REQUEST_COUNT ? t('no_delay') : t('request_being_slowed_down'),
  });
});

/**
 * Handler to send an email using SendGrid.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const sendEmailExampleHandler = asyncCatch(async (req: Request<{}, {}, SendEmailType['body'], {}>, res: Response) => {
  const t = req.t;
  const payload = req.body;

  // Sending email
  const [emailResponse] = await sendEmail(req, {
    templateId: env.template.TEMPLATE_WELCOME,
    to: payload.to,
    dynamicTemplateData: payload.dynamicTemplateData,
  });

  sendHttpResponse(res, STATUS_CODES.OK, t('email_sent'), emailResponse);
});

/**
 * Handler to verify API key.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const verifyApiKeyHandler = asyncCatch(async (req: Request, res: Response) => {
  const t = req.t;

  sendHttpResponse(res, STATUS_CODES.OK, t('api_key_verified'), {
    apiKey: req.apiKey,
    apiKeyStatus: t('api_key_verified'),
  });
});

/**
 * Handler for localization test.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const localizationTestHandler = asyncCatch(async (req: Request, res: Response) => {
  const t = req.t;

  sendHttpResponse(res, STATUS_CODES.OK, t('localization_test'), {
    localization: t('localization_test'),
    details: t('localization_test_details'),
  });
});

/**
 * Handler to upload a file.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const fileUploadExampleHandler = asyncCatch(async (req: Request, res: Response) => {
  const t = req.t;
  const file = req.file as Express.Multer.File;

  if (!file) {
    throw new CustomError(
      STATUS_CODES.NOT_FOUND,
      ERROR_CODES.NOT_FOUND,
      t('file_not_found_message', { ns: 'error' }),
      t('file_not_found_details', { ns: 'error' }),
      t('file_not_found_suggestion', { ns: 'error' }),
    );
  }

  sendHttpResponse(res, STATUS_CODES.OK, t('file_upload'), {
    file: file.originalname,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    message: t('file_uploaded_message'),
  });
});

/**
 * Handler to return performance metrics.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const metricsExampleHandler = asyncCatch(async (req: Request<{}, {}, {}, MetricsType['query']>, res: Response, _next: NextFunction) => {
  const t = req.t;
  const { loop } = req.query;
  const loopNumber = Number(loop);
  let loopCount = 0;

  // Start timing
  const startTime = Date.now();

  // Loop through the count and execute
  const promises = Array.from({ length: loopNumber }, () => {
    loopCount++;
    return new Promise((resolve) => setTimeout(resolve, 1000));
  });
  await Promise.all(promises);

  // Calculate total time taken in seconds
  const totalTime = (Date.now() - startTime) / 1000;

  sendHttpResponse(res, STATUS_CODES.OK, t('metrics_api'), {
    message: t('metrics_api_message'),
    details: t('metrics_api_loop_message', { time: totalTime, loop: loopCount }),
  });
});
