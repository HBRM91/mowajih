import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import type { Env } from "./types/env";

import health from "./routes/health";
import evaluate from "./routes/evaluate";
import chat from "./routes/chat";
import leads from "./routes/leads";
import profiles from "./routes/profiles";
import analytics from "./routes/admin/analytics";
import assistant from "./routes/admin/assistant";
import communications from "./routes/admin/communications";
import live from "./routes/admin/live";
import adminAuthRoute from "./routes/admin/auth";
import adminProfiles from "./routes/admin/profiles";
import adminDossier from "./routes/admin/dossier";
import adminSeuils from "./routes/admin/seuils";
import adminAssets from "./routes/admin/assets";
import adminLeads from "./routes/admin/leads";
import { adminAuth } from "./middleware/adminAuth";

const app = new Hono<{ Bindings: Env }>();

// CORS — localhost origins only allowed in non-production
app.use(cors({
  origin: (origin, c) => {
    const env = (c.env as { ENVIRONMENT?: string }).ENVIRONMENT;
    const production = [
      "https://tawjih.ai",
      "https://admin.tawjih.ai",
      "https://tawjih-web.pages.dev",
      "https://tawjih-admin.pages.dev",
    ];
    // Dynamic Pages preview URLs (pattern: *.pages.dev)
    const isPagesDeploy = /^https:\/\/[a-f0-9]+\.(tawjih-web|tawjih-admin)\.pages\.dev$/.test(origin ?? "");
    const isDev = env !== "production" && (
      origin === "http://localhost:5173" || origin === "http://localhost:5174"
    );
    if (production.includes(origin ?? "") || isPagesDeploy || isDev) return origin;
    return "https://tawjih-web.pages.dev";
  },
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "CF-Access-JWT-Assertion"],
  credentials: true,
}));

// Logger
app.use(logger());

// Security headers + request-id
app.use(async (c, next) => {
  const reqId = crypto.randomUUID();
  c.set("requestId" as never, reqId);
  await next();
  c.header("X-Request-ID", reqId);
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
});

// Routes
app.route("/health", health);
app.route("/api/evaluate", evaluate);
app.route("/api/chat", chat);
app.route("/api/leads", leads);
// Public — save student profile + simulation results (rate-limited)
app.route("/api/profiles", profiles);
// Admin auth (public — issues JWT)
app.route("/api/admin/auth", adminAuthRoute);
// Admin routes protected by JWT
app.use("/api/admin/analytics/*", adminAuth());
app.use("/api/admin/assistant/*", adminAuth());
app.use("/api/admin/communications/*", adminAuth());
app.use("/api/admin/live/*", adminAuth());
app.use("/api/admin/profiles/*", adminAuth());
app.use("/api/admin/dossier/*", adminAuth());
app.use("/api/admin/seuils/*", adminAuth());
app.use("/api/admin/leads/*", adminAuth());
app.route("/api/admin/analytics", analytics);
app.route("/api/admin/assistant", assistant);
app.route("/api/admin/communications", communications);
app.route("/api/admin/live", live);
app.route("/api/admin/profiles", adminProfiles);
app.route("/api/admin/dossier", adminDossier);
app.route("/api/admin/seuils", adminSeuils);
app.route("/api/admin/leads", adminLeads);
app.route("/api/admin/assets", adminAssets);
// Public seuils overrides — read by web app on load
app.get("/api/public/seuils", async (c) => {
  const raw = await c.env.CACHE.get("school_seuils_overrides");
  if (!raw) return c.json({ updates: [], updatedAt: null });
  return c.json(JSON.parse(raw));
});

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
