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
    // Initialize the server
    const server = app.listen(env.app.PORT, () => {
      logger.info(
        `\nServer is running in ${env.app.NODE_ENV} mode\n- Local: http://localhost:${env.app.PORT}\n- Network: http://${getLocalIPAddress()}:${env.app.PORT}`,
      );
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error;

      switch (error.code) {
        case 'EACCES':
          logger.error(`Port ${env.app.PORT} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`Port ${env.app.PORT} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Graceful server shutdown handler
    const onShutdown = async () => {
      logger.info('Shutting down server...');

      // ** NOTE: Add cleanup code here, such as closing database connections. **

      server.close(() => {
        logger.info('Server shut down successfully');
        process.exit(0);
      });
    };

    // Handle termination signals for graceful shutdown
    process.on('SIGINT', onShutdown);
    process.on('SIGTERM', onShutdown);
  } catch (error) {
    logger.error('Error initializing app:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
