import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv-flow';

dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Graceful shutdown when the app is terminated
async function shutdown() {
  await prisma.$disconnect();
}

process.on('SIGINT', shutdown); // Handles termination signals (Ctrl+C)
process.on('SIGTERM', shutdown); // Handles termination signals (when stopping in production)

export default prisma;
