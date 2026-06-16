import { Hono } from "hono";
import { adminAuth } from "../../middleware/adminAuth";
import type { Env } from "../../types/env";

interface ContactMeta {
  uuid: string;
  type: "student" | "b2b";
  requestType: string;
  createdAt: string;
  read: boolean;
}

const app = new Hono<{ Bindings: Env }>();

// GET /api/admin/contact — list contact metadata (zero PII)
app.get("/", adminAuth(), async (c) => {
  const typeFilter = c.req.query("type"); // "student" | "b2b" | omit for all

  const listed = await c.env.CACHE.list({ prefix: "contact:meta:", limit: 200 });

  const entries = await Promise.all(
    listed.keys.map(async (k) => {
      const raw = await c.env.CACHE.get(k.name);
      if (!raw) return null;
      try {
        const meta = JSON.parse(raw) as ContactMeta;
        if (typeFilter && meta.type !== typeFilter) return null;
        return meta;
      } catch {
        return null;
      }
    })
  );

  const submissions = (entries.filter(Boolean) as ContactMeta[]).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return c.json({
    submissions,
    total: submissions.length,
    unread: submissions.filter((s) => !s.read).length,
  });
});

// PATCH /api/admin/contact/:uuid/read — mark metadata entry as read
app.patch("/:uuid/read", adminAuth(), async (c) => {
  const uuid = c.req.param("uuid");

  const listed = await c.env.CACHE.list({ prefix: "contact:meta:" });
  const match = listed.keys.find((k) => k.name.endsWith(`:${uuid}`));
  if (!match) return c.json({ error: "Not found" }, 404);

  const raw = await c.env.CACHE.get(match.name);
  if (!raw) return c.json({ error: "Not found" }, 404);

  const meta = JSON.parse(raw) as ContactMeta;
  meta.read = true;

  await c.env.CACHE.put(match.name, JSON.stringify(meta), {
    expirationTtl: 60 * 60 * 24 * 365 * 2,
  });

  return c.json({ ok: true });
});

export default app;
