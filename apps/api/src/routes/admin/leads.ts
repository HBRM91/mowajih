import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc, and, sql } from "drizzle-orm";
import { leads, universities, students } from "@tawjih/shared";
import type { Env } from "../../types/env";

type LeadStatus = "new" | "contacted" | "converted" | "dormant";

const VALID_STATUSES: LeadStatus[] = ["new", "contacted", "converted", "dormant"];

const app = new Hono<{ Bindings: Env; Variables: { user: { email: string } } }>();

// GET /api/admin/leads — all leads across all universities
app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const rawStatus = c.req.query("status");
  const status = VALID_STATUSES.includes(rawStatus as LeadStatus) ? (rawStatus as LeadStatus) : null;
  const limit = Math.min(parseInt(c.req.query("limit") ?? "200"), 500);

  const rows = await db
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
      universityId: leads.universityId,
      universitySlug: universities.slug,
      universityName: universities.name,
      studentBacTrack: students.bacTrack,
      studentMention: students.mention,
      studentCity: students.city,
      studentRegion: students.region,
      studentGeneralGrade: students.generalGrade,
      studentFinancialBracket: students.financialBracket,
    })
    .from(leads)
    .innerJoin(universities, eq(leads.universityId, universities.id))
    .innerJoin(students, eq(leads.studentUuid, students.uuid))
    .where(status ? eq(leads.status, status) : sql`1=1`)
    .orderBy(desc(leads.createdAt))
    .limit(limit)
    .all();

  return c.json({ leads: rows, total: rows.length });
});

// PATCH /api/admin/leads/:studentUuid/status — update lead status across any university
app.patch("/:studentUuid/status", async (c) => {
  const user = c.get("user");
  const uuid = c.req.param("studentUuid");
  const body = await c.req.json<{ status?: string; notes?: string; universityId?: number }>();

  const db = drizzle(c.env.DB);

  const whereClause = body.universityId
    ? and(eq(leads.studentUuid, uuid), eq(leads.universityId, body.universityId))
    : eq(leads.studentUuid, uuid);

  const safeStatus = VALID_STATUSES.includes(body.status as LeadStatus) ? (body.status as LeadStatus) : undefined;

  await db
    .update(leads)
    .set({
      ...(safeStatus ? { status: safeStatus } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
      assignedTo: user.email,
    })
    .where(whereClause);

  return c.json({ success: true });
});

export default app;
