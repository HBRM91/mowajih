import type { Config } from "drizzle-kit";

export default {
  schema: "./packages/shared/src/schema.ts",
  out: "./tooling/drizzle/migrations",
  dialect: "sqlite",
  driver: "d1",
  dbCredentials: {
    wranglerConfigPath: "./tooling/wrangler/wrangler.toml",
    dbName: "tawjih-db",
  },
} satisfies Config;
