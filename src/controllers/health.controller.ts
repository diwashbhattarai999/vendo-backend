import type { Request, Response } from 'express';

import { STATUS_CODES } from '@/constant/status.codes';

import { asyncCatch } from '@/error/async.catch';

import { sendHttpResponse } from '@/utils/send.http.response';
import { getAppHealthMetrics, getSystemHealthMetrics } from '@/utils/system.utils';

/**
 * Handles health check requests.
 * Returns application and system health metrics.
 *
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const getHealthHandler = asyncCatch(async (req: Request, res: Response) => {
  const t = req.t;

  // Send the health metrics response
  sendHttpResponse(res, STATUS_CODES.OK, t('api_health_check_success'), {
    application: getAppHealthMetrics(),
    system: getSystemHealthMetrics(),
    timestamp: Date.now(),
  });
});
