import type { Request, Response } from 'express';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';
import { CustomError } from '@/error/custom.api.error';

import { sendHttpResponse } from '@/utils/send.http.response';
import { getAppHealthMetrics, getSystemHealthMetrics } from '@/utils/system.utils';

import type { MetricsType } from '@/schema/metrics.schema';

import packageJson from '@/../package.json';

const appName = packageJson.name;
const appEnvironment = env.app.NODE_ENV;
const appVersion = packageJson.version;

/**
 * Root handler that sends basic information about the application.
 */
export const rootRouteHandler = asyncCatch(async (req: Request, res: Response) => {
  const t = req.t;

  // Check if the required variables from package.json and .env are available.
  if (!appName || !appVersion || !appEnvironment) {
    throw new CustomError(STATUS_CODES.BAD_REQUEST, ERROR_CODES.INVALID_JSON_CONFIG, t('invalidJsonConfig', { ns: 'error' }));
  }

  // Send a welcome message with the app name, version, and environment.
  sendHttpResponse(res, STATUS_CODES.OK, t('welcomeMessage'), {
    appName,
    appVersion,
    appEnvironment,
  });
});

/**
 * Handles health check requests.
 * Returns application and system health metrics.
 */
export const getHealthHandler = asyncCatch(async (req: Request, res: Response) => {
  const t = req.t;

  // Send the health metrics response
  sendHttpResponse(res, STATUS_CODES.OK, t('general.api_success'), {
    application: getAppHealthMetrics(),
    system: getSystemHealthMetrics(),
    timestamp: Date.now(),
  });
});

/**
 * Handler to return performance metrics.
 * It simulates a delay based on the loop count provided in the query parameters.
 */
export const metricsHandler = asyncCatch(async (req: Request<{}, {}, {}, MetricsType['query']>, res: Response) => {
  const t = req.t;
  const { loop } = req.query as MetricsType['query'];
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

  sendHttpResponse(res, STATUS_CODES.OK, t('metrics.title'), {
    message: t('metrics.description'),
    details: t('metrics.execution_summary', { time: totalTime, loop: loopCount }),
  });
});
