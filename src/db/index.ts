import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

// Hosted providers such as Neon require SSL. The connection string usually
// carries `sslmode=require`, but enable it explicitly so behaviour does not
// depend on how the installed `pg` version parses the query string.
const useSsl = databaseUrl
  ? /[?&]sslmode=(require|prefer|verify-ca|verify-full)\b/i.test(databaseUrl)
  : false;

const globalForDb = globalThis as typeof globalThis & {
  __simpaPool?: Pool;
};

function createPool(): Pool {
  return new Pool({
    connectionString: databaseUrl,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    // Serverless-friendly defaults (Vercel functions behind the Neon pooler):
    // small pool, quick timeouts so cold/warm invocations never hang.
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
}

const globalPool = globalForDb.__simpaPool ?? (databaseUrl ? createPool() : undefined);
if (process.env.NODE_ENV !== "production" && globalPool) {
  globalForDb.__simpaPool = globalPool;
}

/**
 * Drizzle client. The underlying pool is created lazily so that importing this
 * module during a build (where no request is ever executed) never requires
 * DATABASE_URL to be set. A missing URL therefore only fails at request time,
 * with a clear message.
 */
let client: ReturnType<typeof drizzle> | null = null;
function getClient(): ReturnType<typeof drizzle> {
  if (client) return client;
  if (!globalPool) {
    throw new Error("DATABASE_URL is required");
  }
  client = drizzle(globalPool);
  return client;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return Reflect.get(getClient(), prop);
  },
});
