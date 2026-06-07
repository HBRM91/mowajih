import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, desc } from "drizzle-orm";
import { leads, universities, students } from "@tawjih/shared";
import { auth } from "../middleware/auth";
import { cndpAudit, requireOptIn } from "../middleware/cndpAudit";
import { validate } from "../middleware/validate";
import type { Env } from "../types/env";

const updateSchema = z.object({
  status: z.enum(["new","contacted","converted","dormant"]).optional(),
  notes: z.string().optional(),
});

const app = new Hono<{ Bindings: Env; Variables: { user: { email: string; universityId?: number; roles?: string[] } } }>();

app.get("/", auth("dean"), cndpAudit("LIST_LEADS", "lead"), async (c) => {
  const user = c.get("user");
  const universityId = user.universityId;
  if (!universityId) return c.json({ error: "No university assigned" }, 403);

  const db = drizzle(c.env.DB);
  const data = await db
    .select({
      id: leads.id,
      studentUuid: leads.studentUuid,
      matchProbability: leads.matchProbability,
      matchType: leads.matchType,
      aiRationale: leads.aiRationale,
      hasOptedIn: leads.hasOptedIn,
      optInAt: leads.optInAt,
      status: leads.status,
      assignedTo: leads.assignedTo,
      notes: leads.notes,
      createdAt: leads.createdAt,
      universitySlug: universities.slug,
      universityName: universities.name,
      studentBacTrack: students.bacTrack,
      studentMention: students.mention,
      studentCity: students.city,
    })
    .from(leads)
    .innerJoin(universities, eq(leads.universityId, universities.id))
    .innerJoin(students, eq(leads.studentUuid, students.uuid))
    .where(eq(leads.universityId, universityId))
    .orderBy(desc(leads.createdAt))
    .all();

  // Privacy: strip any accidental PII if not opted in
  const sanitized = data.map((row) => ({
    ...row,
    studentCity: row.hasOptedIn ? row.studentCity : null,
  }));

  return c.json(sanitized);
});

app.get("/:uuid", auth("dean"), cndpAudit("VIEW_LEAD", "lead"), async (c) => {
  const uuid = c.req.param("uuid");
  const user = c.get("user");
  const universityId = user.universityId;
  if (!universityId) return c.json({ error: "No university assigned" }, 403);

  const db = drizzle(c.env.DB);
  const lead = await db
    .select()
    .from(leads)
    .where(and(eq(leads.studentUuid, uuid), eq(leads.universityId, universityId)))
    .get();

  if (!lead) return c.json({ error: "Lead not found" }, 404);

  const optedIn = await requireOptIn(c as unknown as Parameters<typeof requireOptIn>[0], uuid, universityId);
  if (!optedIn && lead.hasOptedIn === false) {
    return c.json({ error: "Opt-in required to view PII" }, 403);
  }

  return c.json(lead);
});

app.post("/:uuid", auth("dean"), validate("json", updateSchema), cndpAudit("UPDATE_LEAD", "lead"), async (c) => {
  const uuid = c.req.param("uuid");
  const body = c.req.valid("json");
  const user = c.get("user");
  const universityId = user.universityId;
  if (!universityId) return c.json({ error: "No university assigned" }, 403);

  const db = drizzle(c.env.DB);
  await db
    .update(leads)
    .set({
      ...(body.status ? { status: body.status } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      assignedTo: user.email,
    })
    .where(and(eq(leads.studentUuid, uuid), eq(leads.universityId, universityId)));

  return c.json({ success: true });
});

export default app;
