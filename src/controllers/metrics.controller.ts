import type { NextFunction, Request, Response } from 'express';

import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';

import { sendHttpResponse } from '@/utils/send.http.response';

import type { MetricsType } from '@/schema/metrics.schema';

/**
 * Handler to return performance metrics.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const metricsHandler = asyncCatch(async (req: Request<{}, {}, {}, MetricsType['query']>, res: Response, _next: NextFunction) => {
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

  sendHttpResponse(res, STATUS_CODES.OK, t('metrics.title'), {
    message: t('metrics.description'),
    details: t('metrics.execution_summary', { time: totalTime, loop: loopCount }),
  });
});
