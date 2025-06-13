import { PrismaPg, withBemiExtension } from "@bemi-db/prisma";
import { PrismaClient } from "@prisma/client";

import { env } from "@/env";

const createPrismaClient = () =>
  withBemiExtension(
    new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
      log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
  );

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
