// Shared Prisma client. In development Next/tsx hot reload would create many
// instances, so we keep a singleton on globalThis.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { aksamPrisma?: PrismaClient };

export const prisma = globalForPrisma.aksamPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.aksamPrisma = prisma;
}
