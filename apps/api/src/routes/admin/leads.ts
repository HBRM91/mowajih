import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc, and, sql, gte, lte } from "drizzle-orm";
import { leads, universities, students } from "@tawjih/shared";
import type { Env } from "../../types/env";

// --- CSV helpers ---

function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCSV(headers: string[], rows: string[][]): string {
  const BOM = "﻿";
  const lines = [headers.map(csvEscape).join(",")];
  for (const row of rows) lines.push(row.map(csvEscape).join(","));
  return BOM + lines.join("\r\n");
}

function formatCostBracket(bracket: string | null): string {
  if (!bracket) return "";
  const map: Record<string, string> = {
    "<<3000": "< 3 000 MAD/mois",
    "3000-8000": "3 000 – 8 000 MAD/mois",
    "8000-15000": "8 000 – 15 000 MAD/mois",
    ">15000": "> 15 000 MAD/mois",
  };
  return map[bracket] ?? bracket;
}

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

// GET /api/admin/leads/private-school — students who consented to private school sharing
app.get("/private-school", async (c) => {
  const db = drizzle(c.env.DB);
  const bacTrack = c.req.query("bacTrack");
  const mention = c.req.query("mention");
  const city = c.req.query("city");
  const minGrade = parseFloat(c.req.query("minGrade") ?? "0");
  const maxGrade = parseFloat(c.req.query("maxGrade") ?? "20");
  const financialBracket = c.req.query("financialBracket");
  const limit = Math.min(parseInt(c.req.query("limit") ?? "200"), 1000);

  const rows = await db
    .select({
      uuid: students.uuid,
      firstName: students.firstName,
      lastName: students.lastName,
      emailContact: students.emailContact,
      phoneContact: students.phoneContact,
      bacTrack: students.bacTrack,
      generalGrade: students.generalGrade,
      mention: students.mention,
      city: students.city,
      region: students.region,
      financialBracket: students.financialBracket,
      consentPrivateAt: students.consentPrivateAt,
      aiResults: students.aiResults,
      createdAt: students.createdAt,
    })
    .from(students)
    .where(and(
      eq(students.consentPrivateSchools, true),
      bacTrack ? eq(students.bacTrack, bacTrack as "SM" | "PC" | "SVT" | "SE" | "SH" | "STI" | "L") : sql`1=1`,
      mention ? eq(students.mention, mention as "Passable" | "Assez Bien" | "Bien" | "Très Bien") : sql`1=1`,
      city ? eq(students.city, city as "Casablanca") : sql`1=1`,
      financialBracket ? eq(students.financialBracket, financialBracket as "<<3000") : sql`1=1`,
      gte(students.generalGrade, isNaN(minGrade) ? 0 : minGrade),
      lte(students.generalGrade, isNaN(maxGrade) ? 20 : maxGrade),
    ))
    .orderBy(desc(students.createdAt))
    .limit(limit)
    .all();

  // Compute top 3 target schools from aiResults
  const enriched = rows.map((r) => {
    const topSchools = (r.aiResults?.matches ?? [])
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3)
      .map((m) => m.university_slug);
    return { ...r, topSchools };
  });

  return c.json({ leads: enriched, total: enriched.length });
});

// GET /api/admin/leads/private-school/export — CSV download
app.get("/private-school/export", async (c) => {
  const db = drizzle(c.env.DB);
  const bacTrack = c.req.query("bacTrack");
  const mention = c.req.query("mention");
  const city = c.req.query("city");
  const financialBracket = c.req.query("financialBracket");
  const minGrade = parseFloat(c.req.query("minGrade") ?? "0");
  const maxGrade = parseFloat(c.req.query("maxGrade") ?? "20");

  const rows = await db
    .select({
      uuid: students.uuid,
      firstName: students.firstName,
      lastName: students.lastName,
      emailContact: students.emailContact,
      phoneContact: students.phoneContact,
      bacTrack: students.bacTrack,
      generalGrade: students.generalGrade,
      mention: students.mention,
      city: students.city,
      region: students.region,
      financialBracket: students.financialBracket,
      consentPrivateAt: students.consentPrivateAt,
      aiResults: students.aiResults,
      createdAt: students.createdAt,
    })
    .from(students)
    .where(and(
      eq(students.consentPrivateSchools, true),
      bacTrack ? eq(students.bacTrack, bacTrack as "SM" | "PC" | "SVT" | "SE" | "SH" | "STI" | "L") : sql`1=1`,
      mention ? eq(students.mention, mention as "Passable" | "Assez Bien" | "Bien" | "Très Bien") : sql`1=1`,
      city ? eq(students.city, city as "Casablanca") : sql`1=1`,
      financialBracket ? eq(students.financialBracket, financialBracket as "<<3000") : sql`1=1`,
      gte(students.generalGrade, isNaN(minGrade) ? 0 : minGrade),
      lte(students.generalGrade, isNaN(maxGrade) ? 20 : maxGrade),
    ))
    .orderBy(desc(students.createdAt))
    .limit(5000)
    .all();

  const headers = [
    "Prénom", "Nom", "Email", "Téléphone",
    "Filière Bac", "Note Générale", "Mention",
    "Ville", "Région", "Budget Mensuel",
    "École Cible #1", "École Cible #2", "École Cible #3",
    "Date Consentement", "ID Anonyme"
  ];

  const csvRows = rows.map((r) => {
    const topSchools = (r.aiResults?.matches ?? [])
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3)
      .map((m) => m.university_slug);
    const consentDate = r.consentPrivateAt
      ? new Date(r.consentPrivateAt).toLocaleDateString("fr-MA")
      : new Date(r.createdAt ?? Date.now()).toLocaleDateString("fr-MA");

    return [
      r.firstName ?? "",
      r.lastName ?? "",
      r.emailContact ?? "",
      r.phoneContact ?? "",
      r.bacTrack,
      r.generalGrade.toFixed(2),
      r.mention,
      r.city,
      r.region,
      formatCostBracket(r.financialBracket),
      topSchools[0] ?? "",
      topSchools[1] ?? "",
      topSchools[2] ?? "",
      consentDate,
      r.uuid.slice(0, 8),
    ];
  });

  const csv = toCSV(headers, csvRows);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="jad2-leads-ecoles-privees-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
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
