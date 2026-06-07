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
}
