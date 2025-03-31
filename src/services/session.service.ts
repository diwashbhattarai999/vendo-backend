import prisma from '@/database/prisma-client';

export const deleteSessionByUserId = async (userId: string) => await prisma.session.deleteMany({ where: { userId } });
