import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import type { Env } from "./types/env";

import health from "./routes/health";
import evaluate from "./routes/evaluate";
import leads from "./routes/leads";
import analytics from "./routes/admin/analytics";
import assistant from "./routes/admin/assistant";
import communications from "./routes/admin/communications";
import live from "./routes/admin/live";

const app = new Hono<{ Bindings: Env }>();

// CORS
app.use(cors({
  origin: (origin) => {
    const allowed = [
    "https://tawjih.ai",
    "https://admin.tawjih.ai",
    "https://tawjih-web.pages.dev",
    "https://12902265.tawjih-web.pages.dev",
    "https://tawjih-admin.pages.dev",
    "https://ee6ccb2c.tawjih-admin.pages.dev",
    "http://localhost:5173",
    "http://localhost:5174",
  ];
    return allowed.includes(origin) ? origin : "https://tawjih.ai";
  },
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "CF-Access-JWT-Assertion"],
  credentials: true,
}));

// Logger
app.use(logger());

// Security headers
app.use(async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
});

// Routes
app.route("/health", health);
app.route("/api/evaluate", evaluate);
app.route("/api/leads", leads);
app.route("/api/admin/analytics", analytics);
app.route("/api/admin/assistant", assistant);
app.route("/api/admin/communications", communications);
app.route("/api/admin/live", live);

// Error handling
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal server error", detail: c.env.ENVIRONMENT === "development" ? String(err) : undefined }, 500);
});

// 404
app.notFound((c) => c.json({ error: "Not found" }, 404));

export { LeadStreamDO } from "./services/leadStreamDO";
export default app;
