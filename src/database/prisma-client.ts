import { PrismaClient } from '@prisma/client';

import { isDevelopment } from '@/utils/env.utils';

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

if (isDevelopment) global.prisma = prisma;

export default prisma;
