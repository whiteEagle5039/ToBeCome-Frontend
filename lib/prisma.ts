import { PrismaClient } from "@prisma/client";

/**
 * Client Prisma partagé côté Next.js (espace collège).
 * Singleton pour éviter d'ouvrir une connexion à chaque hot-reload en dev.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
