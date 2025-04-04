import { env } from '@/config/env';

import { getLocalIPAddress } from '@/utils/system.utils';

import app from '@/app';
import { logger } from '@/logger/winston.logger';

/**
 * Starts the server and handles various server operations like logging, error handling, and shutdown.
 *
 * - Listens on the port specified in the environment variables.
 * - Logs server start, including local and network addresses.
 * - Handles server errors such as permission issues and address in use.
 * - Gracefully shuts down the server on termination signals (SIGINT, SIGTERM).
 */
const startServer = () => {
  try {
    const { PORT, NODE_ENV } = env.app;

    // Initialize the server
    const server = app.listen(PORT, () => {
      logger.info(`\nServer is running in ${NODE_ENV} mode\n- Local: http://localhost:${PORT}\n- Network: http://${getLocalIPAddress()}:${PORT}`);
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error;

      // Handle specific error codes using a dictionary
      // to map error codes to user-friendly messages
      const messages: Record<string, string> = {
        EACCES: `Port ${PORT} requires elevated privileges.`,
        EADDRINUSE: `Port ${PORT} is already in use.`,
      };

      // Log the error message and exit the process if it matches a known error code
      // Otherwise, throw the error for further handling
      if (messages[error.code!]) {
        logger.error(messages[error.code!]);
        process.exit(1);
      } else {
        throw error;
      }
    });

    /**
     * Graceful shutdown handler.
     * Ensures cleanup before shutting down the server.
     */
    const shutdown = async () => {
      logger.info('Shutting down server...');

      try {
        server.close(() => {
          logger.info('Server shut down successfully.');
          process.exit(0);
        });
      } catch (err) {
        logger.error('Error during shutdown:', err);
        process.exit(1);
      }
    };

    // Handle termination signals for graceful shutdown
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Error initializing app:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
