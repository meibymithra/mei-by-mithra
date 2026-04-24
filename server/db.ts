import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createMockPrisma() {
  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      if (prop === "then") return undefined;
      if (prop === "toJSON") return () => null;
      return new Proxy(
        {},
        {
          get(_nestedTarget, nestedProp) {
            if (nestedProp === "then") return undefined;
            return async () => {
              const method = String(nestedProp);
              if (method === "findMany") return [];
              if (method === "findFirst" || method === "findUnique" || method === "aggregate") return null;
              if (method === "groupBy") return [];
              if (method === "count") return 0;
              if (method === "create" || method === "update" || method === "upsert") return {};
              if (method === "updateMany" || method === "deleteMany") return { count: 0 };
              return {};
            };
          }
        }
      );
    }
  };

  return new Proxy({}, handler) as PrismaClient;
}

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const isProductionRuntime = process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build";

if (isProductionRuntime && !hasDatabaseUrl) {
  throw new Error("DATABASE_URL is required in production.");
}

export const prisma =
  global.prisma ??
  (hasDatabaseUrl
    ? new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
      })
    : createMockPrisma());

if (process.env.NODE_ENV !== "production" && hasDatabaseUrl) global.prisma = prisma;
