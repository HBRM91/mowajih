import { createMiddleware } from "hono/factory";
import { verifyAdminJWT } from "../routes/admin/auth";
import type { Env } from "../types/env";

export function adminAuth() {
  return createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized — missing token" }, 401);
    }
    const token = authHeader.slice(7);
    if (!c.env.JWT_SECRET) {
      return c.json({ error: "Server misconfiguration" }, 503);
    }
    const payload = await verifyAdminJWT(token, c.env.JWT_SECRET);
    if (!payload || payload.role !== "admin") {
      return c.json({ error: "Unauthorized — invalid or expired token" }, 401);
    }
    await next();
    return;
  });
}
