import { createMiddleware } from "hono/factory";
import type { Env } from "../types/env";

// Limits: requests per window per IP
const LIMITS: Record<string, number> = { b2c: 60, b2b: 120, evaluate: 8 };
const WINDOWS: Record<string, number> = { b2c: 60, b2b: 60, evaluate: 60 };

export function rateLimit(type: "b2c" | "b2b" | "evaluate") {
  return createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const ip = c.req.header("CF-Connecting-IP") || "unknown";

    // Block high-threat IPs (Cloudflare threat score, available on all plans)
    const threatScore = parseInt(c.req.header("CF-Threat-Score") ?? "0", 10);
    if (threatScore > 50) {
      return c.json({ error: "Request blocked" }, 403);
    }

    const key = `rl:${type}:${ip}`;
    const limit = LIMITS[type] ?? 30;
    const window = WINDOWS[type] ?? 60;

    // Increment-first pattern to reduce race-condition window
    const current = await c.env.CACHE.get(key);
    const count = (current ? parseInt(current, 10) : 0) + 1;
    // Write new count unconditionally — short TTL makes stale writes harmless
    await c.env.CACHE.put(key, String(count), { expirationTtl: window });

    if (count > limit) {
      c.header("Retry-After", String(window));
      return c.json({ error: "Trop de requêtes — réessayez dans une minute." }, 429);
    }

    await next();
    return;
  });
}
