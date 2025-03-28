import type { NextFunction, Request, Response } from 'express';
import client from 'prom-client';

/**
 * Default Prometheus metrics collection
 * Sets up the default metrics to be collected at regular intervals.
 */
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

/**
 * Histogram to track HTTP request duration
 * It tracks the time taken to process HTTP requests with labels for method, route, and status code.
 */
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 2, 5], // Custom duration buckets
});

/**
 * Middleware to track the duration of HTTP requests and send the metrics to Prometheus.
 *
 * It calculates the time taken to process a request and records it in the Prometheus Histogram.
 */
export const prometheusMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;
    httpRequestDuration.labels(req.method, req.route ? req.route.path : req.path, String(res.statusCode)).observe(durationInSeconds);
  });

  next();
};

/**
 * Endpoint to expose Prometheus metrics.
 * When a GET request is made to this endpoint, it returns the current metrics data.
 */
export const metrics = async (_req: Request, res: Response) => {
  res.setHeader('Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
};
