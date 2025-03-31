// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';
import type { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends PrismaUser {}
    interface Request {
      sessionId?: string;
    }
  }
}
