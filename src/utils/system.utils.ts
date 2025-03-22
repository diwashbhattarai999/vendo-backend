import os, { networkInterfaces } from 'os';

import { env } from '@/config/env';

/**
 * Retrieves system health metrics, including CPU usage and memory stats.
 *
 * @see {@link https://nodejs.org/api/os.html#os_os_loadavg}
 * @returns {Object} An object containing the system's CPU usage and memory stats.
 * @example
 * {
 *   cpuUsage: [0.5, 0.6, 0.7],
 *   totalMemory: '8192.00 MB',
 *   freeMemory: '2048.00 MB'
 * }
 */
export const getSystemHealthMetrics = () => {
  return {
    cpuUsage: os.loadavg(),
    totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
    freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
  };
};

/**
 * Retrieves application health metrics such as environment, uptime, and memory usage.
 *
 * @see {@link https://nodejs.org/api/process.html#process_process_memoryusage}
 * @returns {Object} An object containing the application's environment, uptime, and memory usage stats.
 * @example
 * {
 *   environment: 'production',
 *   uptime: '1234.56 seconds',
 *   memoryUsage: {
 *     heapTotal: '50.50 MB',
 *     heapUsed: '40.50 MB'
 *   }
 * }
 */
export const getAppHealthMetrics = () => {
  return {
    environment: env.app.NODE_ENV,
    uptime: `${process.uptime().toFixed(2)} seconds`,
    memoryUsage: {
      heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
    },
  };
};

/**
 * Retrieves the local IP address of the system.
 *
 * @see {@link https://nodejs.org/api/os.html#os_os_networkinterfaces}
 * @returns {string | undefined} The local IP address if found, otherwise undefined.
 * @example
 * '192.168.1.1'
 */
export const getLocalIPAddress = () => {
  const nets = networkInterfaces();
  let localIp: string | undefined;

  // Find a suitable IP address (non-internal IPv4)
  Object.keys(nets).forEach((interfaceName) => {
    nets[interfaceName]?.forEach((net) => {
      if (net.family === 'IPv4' && !net.internal) {
        localIp = net.address;
      }
    });
  });

  return localIp;
};
