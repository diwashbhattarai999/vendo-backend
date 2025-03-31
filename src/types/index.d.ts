import type { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends PrismaUser {}
    interface Request {
      sessionId?: string;
    }
  }
}
