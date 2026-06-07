import { createMiddleware } from "hono/factory";
import { drizzle } from "drizzle-orm/d1";
import { eq, and } from "drizzle-orm";
import { auditLogs, leads } from "@tawjih/shared";
import type { Env } from "../types/env";

export function cndpAudit(action: string, resourceType: string) {
  return createMiddleware<{ Bindings: Env; Variables: { user?: { email?: string } } }>(async (c, next) => {
    const ip = c.req.header("CF-Connecting-IP") || "unknown";
    const pepper = c.env.IP_PEPPER;
    const ipHash = await hashIp(ip, pepper);
    const actorId = c.get("user")?.email || "anonymous";

    await next();

    const resourceId = c.req.param("id") || c.req.param("uuid") || "batch";
    const db = drizzle(c.env.DB);

    await db.insert(auditLogs).values({
      actorType: actorId === "system" ? "system" : actorId === "anonymous" ? "student" : "dean",
      actorId,
      action,
      resourceType,
      resourceId,
      ipHash,
      metadata: JSON.stringify({ path: c.req.path, method: c.req.method, status: c.res.status }),
    });

    c.header("x-cndp-audit-id", `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  });
}

async function hashIp(ip: string, pepper: string): Promise<string> {
  const data = new TextEncoder().encode(ip + pepper);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function requireOptIn(
  c: { env: { DB: D1Database; IP_PEPPER: string }; req: { header: (name: string) => string | null }; get: (key: string) => { email?: string } | undefined },
  studentUuid: string,
  universityId: number
): Promise<boolean> {
  const db = drizzle(c.env.DB);
  const lead = await db
    .select()
    .from(leads)
    .where(and(eq(leads.studentUuid, studentUuid), eq(leads.universityId, universityId)))
    .get();

  if (!lead || !lead.hasOptedIn) {
    await db.insert(auditLogs).values({
      actorType: "dean",
      actorId: c.get("user")?.email || "unknown",
      action: "VIEW_PII_BLOCKED",
      resourceType: "student",
      resourceId: studentUuid,
      ipHash: await hashIp(c.req.header("CF-Connecting-IP") || "unknown", c.env.IP_PEPPER),
      metadata: JSON.stringify({ reason: "opt-in required", universityId }),
    });
    return false;
  }
  return true;
}
