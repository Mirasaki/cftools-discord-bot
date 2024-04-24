import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export { Prisma, WebhookEventType } from '@prisma/client';
