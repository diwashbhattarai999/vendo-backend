import prisma from '@/database/prisma-client';

export const deleteSessionByUserId = async (userId: string) => await prisma.session.deleteMany({ where: { userId } });

export const deleteSessionById = async (sessionId: string) => await prisma.session.delete({ where: { id: sessionId } });
