import { PrismaClient } from '@prisma/client';

import { isDevelopment } from '@/utils/env.utils';

import { logger } from '@/logger/winston.logger';

/**
 * This file is used to create a singleton instance of PrismaClient.
 * It ensures that only one instance of PrismaClient is created and reused throughout the application.
 * This is important for performance and to avoid connection issues with the database.
 */

// Extend the NodeJS global object to include the PrismaClient instance
interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

// Create a global variable to hold the PrismaClient instance
declare const global: CustomNodeJsGlobal;

// Create a new PrismaClient instance
const prisma = global.prisma || new PrismaClient();

// If in development mode, use the global instance to avoid creating multiple instances
if (isDevelopment) global.prisma = prisma;

// Export the PrismaClient instance for use in other parts of the application
export default prisma;

export async function connectDB() {
  try {
    await prisma.$connect();
    logger.info('🚀 Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection error:', error);
    logger.error('❌ Exiting process due to database connection error');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
