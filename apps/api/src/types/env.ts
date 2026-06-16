export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  VECTORIZE: VectorizeIndex;
  LEAD_STREAM: DurableObjectNamespace;
  GEMINI_API_KEY: string;
  OPENROUTER_API_KEY: string;
  IP_PEPPER: string;
  TURNSTILE_SECRET_KEY: string;
  CLOUDFLARE_ACCESS_TEAM_DOMAIN: string;
  ENVIRONMENT: "development" | "production";
  // Resend email relay (set via: wrangler secret put RESEND_API_KEY --config tooling/wrangler/wrangler.toml)
  RESEND_API_KEY: string;
  // Admin password auth (set these in Cloudflare Workers secrets)
  JWT_SECRET: string;
  ADMIN_PASSWORD_HASH: string;  // PBKDF2-SHA256 hash of admin password, base64url
  ADMIN_PASSWORD_SALT: string;  // Random salt used during hashing
  ADMIN_EMAIL: string;          // Admin login email (default: admin@jad2advisory.com)
}
