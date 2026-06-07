import { createMiddleware } from "hono/factory";
import type { Env } from "../types/env";

export function rateLimit(type: "b2c" | "b2b" | "evaluate") {
  return createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const ip = c.req.header("CF-Connecting-IP") || "unknown";
    const key = `ratelimit:${type}:${ip}`;
    const limits = { b2c: 60, b2b: 120, evaluate: 5 };
    const window = type === "evaluate" ? 60 : 60;

    const current = await c.env.CACHE.get(key);
    const count = current ? parseInt(current, 10) : 0;

    if (count >= limits[type]) {
      return c.json({ error: "Rate limit exceeded" }, 429);
    }

    await c.env.CACHE.put(key, String(count + 1), { expirationTtl: window });
    await next();
    return;
  });
}
