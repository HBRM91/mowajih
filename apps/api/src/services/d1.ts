import { drizzle } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb(db: D1Database) {
  if (!dbInstance) {
    dbInstance = drizzle(db);
  }
  return dbInstance;
}

export function resetDb() {
  dbInstance = null;
}
