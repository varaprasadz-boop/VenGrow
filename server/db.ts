import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Lazy initialization - don't check DATABASE_URL at module load time
// This allows dotenv to load first in production builds
let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getPool(): Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
      );
    }
    _pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      // SSL configuration for VPS PostgreSQL
      ssl: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' 
        ? { rejectUnauthorized: false } // Set to true if you have proper SSL certificates
        : false
    });
  }
  return _pool;
}

function getDb() {
  if (!_db) {
    _db = drizzle({ client: getPool(), schema });
  }
  return _db;
}

// Export getters that lazily initialize
export const pool = new Proxy({} as Pool, {
  get(_, prop) {
    return (getPool() as any)[prop];
  }
});

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  }
});
