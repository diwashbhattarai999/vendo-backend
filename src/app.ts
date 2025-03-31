import express, { type Express } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import ruid from 'express-ruid';
import useragent from 'express-useragent';
import helmet from 'helmet';
import morgan from 'morgan';
import requestIp from 'request-ip';
import favicon from 'serve-favicon';

import { env } from '@/config/env';

import { globalErrorHandler } from '@/error/global.error.handler';

import { i18nextMiddleware } from '@/middlewares/i18next';
import { passport } from '@/middlewares/passport';
import { rateLimiter } from '@/middlewares/rate.limiter';
import { routeNotFoundHandler } from '@/middlewares/route.not.found';

import { rootRouter } from '@/routes/root.route';
import { router } from '@/routes/v0';

import { metrics, prometheusMiddleware } from '@/metrics/prometheus';

/**
 * Initializes the Express application with middleware and routes.
 *
 * Sets up core, security, localization, parsing, logging, and performance middleware.
 * Registers routes for metrics, root, and API endpoints.
 * Configures error handling and rate limiting.
 *
 * @returns {Express} Configured Express application instance.
 */
const app: Express = express();

/**
 * CORE MIDDLEWARE
 * Essential middleware that should run first for every request.
 */
app.use(ruid({ setHeader: true })); // Assigns a unique ID to each request
app.use(requestIp.mw()); // Extracts client IP address
app.use(useragent.express()); // Parses user agent information

/**
 * LOCALIZATION MIDDLEWARE
 * Handles internationalization and language preferences.
 */
app.use(i18nextMiddleware); // Adds internationalization support

/**
 * SECURITY MIDDLEWARE
 * Protection-related middleware to secure the application.
 */
app.use(helmet()); // Sets various HTTP headers for security
app.use(
  cors({
    origin: env.app.CLIENT_URL, // Configures allowed origins for CORS
    credentials: true, // Allows cookies and credentials in cross-origin requests
  }),
);
app.use(rateLimiter); // Limits request rate to prevent abuse

/**
 * AUTHENTICATION MIDDLEWARE
 * Initializes Passport for authentication.
 */
app.use(passport.initialize());

/**
 * PARSING MIDDLEWARE
 * Handles request body and data parsing.
 */
app.use(express.json({ limit: '1mb' })); // JSON body parser with size limit
app.use(express.urlencoded({ extended: true, limit: '500kb' })); // URL-encoded data parser
app.use(cookieParser()); // Cookie parser

/**
 * PERFORMANCE & UTILITY MIDDLEWARE
 * Enhances response delivery and application performance.
 */
app.use(compression()); // Compresses response bodies for better performance

/**
 * STATIC MIDDLEWARE
 * Serves static files from the public directory.
 */
app.use(express.static('public')); // Serves static files from public directory
app.use(favicon('public/favicon.ico')); // Serves favicon.ico from public directory

/**
 * LOGGING MIDDLEWARE
 * Logs HTTP requests for debugging and monitoring.
 */
app.use(morgan(env.app.LOG_LEVEL)); // HTTP request logger with configurable log level

/**
 * PROMETHEUS MIDDLEWARE
 * Collects and exposes application metrics for monitoring.
 */
app.use(prometheusMiddleware); // Exposes Prometheus metrics endpoint

/**
 * ROUTES
 * Registers the routes for the application.
 */
app.get('/metrics', metrics); // Exposes application metrics for Prometheus scraping
app.use('/', rootRouter); // Base routes for the application
app.use('/api/v0', router); // API version 0 routes

/**
 * ERROR HANDLING MIDDLEWARE
 * Handles errors after all routes have been processed.
 */
app.use(routeNotFoundHandler); // Handles 404 errors for undefined routes
app.use(globalErrorHandler); // Global error handler for unhandled errors

export default app;
