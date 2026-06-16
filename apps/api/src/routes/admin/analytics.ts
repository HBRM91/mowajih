import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, gte, desc, sql, count, avg, sum } from "drizzle-orm";
import { leads, universities, students } from "@tawjih/shared";
import { auth } from "../../middleware/auth";
import { adminAuth } from "../../middleware/adminAuth";
import type { Env } from "../../types/env";

const app = new Hono<{ Bindings: Env; Variables: { user: { email: string; universityId?: number } } }>();

// ── Per-university analytics (for schools) ───────────────────────────────────
app.get("/", auth("dean"), async (c) => {
  const user = c.get("user");
  const universityId = user.universityId;
  if (!universityId) return c.json({ error: "No university assigned" }, 403);

  const db = drizzle(c.env.DB);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    newLeads,
    avgProbability,
    optInCount,
    totalLeads,
    potentialRevenue,
    topTracks,
    monthlyTrend,
  ] = await Promise.all([
    db.select({ count: count() }).from(leads).where(
      and(eq(leads.universityId, universityId), gte(leads.createdAt, thirtyDaysAgo))
    ).get(),
    db.select({ avg: avg(leads.matchProbability) }).from(leads).where(
      and(eq(leads.universityId, universityId), gte(leads.createdAt, thirtyDaysAgo))
    ).get(),
    db.select({ count: count() }).from(leads).where(
      and(eq(leads.universityId, universityId), eq(leads.hasOptedIn, true))
    ).get(),
    db.select({ count: count() }).from(leads).where(eq(leads.universityId, universityId)).get(),
    db.select({ total: sum(universities.optInCost) })
      .from(leads)
      .innerJoin(universities, eq(leads.universityId, universities.id))
      .where(and(eq(leads.universityId, universityId), eq(leads.hasOptedIn, true)))
      .get(),
    db.select({ bacTrack: students.bacTrack, count: count() })
      .from(leads)
      .innerJoin(students, eq(leads.studentUuid, students.uuid))
      .where(eq(leads.universityId, universityId))
      .groupBy(students.bacTrack)
      .orderBy(sql`count(*) DESC`)
      .limit(7),
    db.select({
      month: sql<string>`strftime('%Y-%m', ${leads.createdAt})`,
      count: count(),
      optIns: sql<number>`SUM(CASE WHEN ${leads.hasOptedIn} = 1 THEN 1 ELSE 0 END)`,
    })
      .from(leads)
      .where(eq(leads.universityId, universityId))
      .groupBy(sql`strftime('%Y-%m', ${leads.createdAt})`)
      .orderBy(sql`strftime('%Y-%m', ${leads.createdAt})`)
      .limit(6),
  ]);

  const uni = await db.select().from(universities).where(eq(universities.id, universityId)).get();

  return c.json({
    kpis: {
      leadsThisMonth: newLeads?.count ?? 0,
      avgProbability: avgProbability?.avg ? parseFloat(avgProbability.avg) : 0,
      optInCount: optInCount?.count ?? 0,
      totalLeads: totalLeads?.count ?? 0,
      potentialRevenue: potentialRevenue?.total ? parseInt(potentialRevenue.total) : 0,
      remainingQuota: (uni?.monthlyQuota ?? 50) - (totalLeads?.count ?? 0),
      conversionRate: totalLeads?.count ? ((optInCount?.count ?? 0) / totalLeads.count) * 100 : 0,
    },
    topTracks,
    monthlyTrend,
  });
});

// ── Platform-wide analytics (for JAD2 Advisory consultants) ─────────────────
app.get("/platform", adminAuth(), async (c) => {
  const db = drizzle(c.env.DB);

  const [
    totalStudents,
    totalLeads,
    totalOptIns,
    totalConverted,
    totalWithContact,
    consentPrivateLeads,
    todaySimulations,
    avgGradeResult,
    mentionDist,
    trackDist,
    regionDist,
    budgetDist,
    trend30d,
    recentProfiles,
    leadStatusDist,
    monthlyRevenue,
  ] = await Promise.all([
    db.select({ count: count() }).from(students).get(),
    db.select({ count: count() }).from(leads).get(),
    db.select({ count: count() }).from(leads).where(eq(leads.hasOptedIn, true)).get(),
    db.select({ count: count() }).from(leads).where(eq(leads.status, "converted")).get(),
    db.select({ count: count() }).from(students)
      .where(sql`${students.emailContact} IS NOT NULL AND ${students.emailContact} != ''`).get(),
    // Private school consent leads
    db.select({ count: count() }).from(students).where(eq(students.consentPrivateSchools, true)).get(),
    // Simulations today
    db.select({ count: count() }).from(students)
      .where(sql`date(${students.createdAt}) = date('now')`).get(),
    // Average general grade across all students
    db.select({ avg: avg(students.generalGrade) }).from(students).get(),

    // Mention distribution
    db.select({ mention: students.mention, count: count() })
      .from(students)
      .groupBy(students.mention)
      .orderBy(sql`count(*) DESC`)
      .all(),

    // Track distribution with average grade
    db.select({
      bacTrack: students.bacTrack,
      count: count(),
      avgGrade: avg(students.generalGrade),
    })
      .from(students)
      .groupBy(students.bacTrack)
      .orderBy(sql`count(*) DESC`)
      .all(),

    // Top regions
    db.select({ region: students.region, count: count() })
      .from(students)
      .where(sql`${students.region} IS NOT NULL AND ${students.region} != ''`)
      .groupBy(students.region)
      .orderBy(sql`count(*) DESC`)
      .limit(12)
      .all(),

    // Financial bracket distribution
    db.select({ bracket: students.financialBracket, count: count() })
      .from(students)
      .where(sql`${students.financialBracket} IS NOT NULL AND ${students.financialBracket} != ''`)
      .groupBy(students.financialBracket)
      .orderBy(sql`count(*) DESC`)
      .all(),

    // 30-day simulation trend (daily)
    db.select({
      day: sql<string>`date(${students.createdAt})`,
      count: count(),
    })
      .from(students)
      .where(sql`${students.createdAt} >= datetime('now', '-30 days')`)
      .groupBy(sql`date(${students.createdAt})`)
      .orderBy(sql`date(${students.createdAt})`)
      .all(),

    // Recent 8 profiles
    db.select({
      uuid: students.uuid,
      bacTrack: students.bacTrack,
      mention: students.mention,
      city: students.city,
      region: students.region,
      generalGrade: students.generalGrade,
      financialBracket: students.financialBracket,
      createdAt: students.createdAt,
    })
      .from(students)
      .orderBy(desc(students.createdAt))
      .limit(8)
      .all(),

    // Lead status distribution
    db.select({ status: leads.status, count: count() })
      .from(leads)
      .groupBy(leads.status)
      .all(),

    // Monthly revenue (opt-ins × cost, last 6 months)
    db.select({
      month: sql<string>`strftime('%Y-%m', ${leads.createdAt})`,
      revenue: sql<number>`SUM(CASE WHEN ${leads.hasOptedIn} = 1 THEN ${universities.optInCost} ELSE 0 END)`,
      optIns: sql<number>`SUM(CASE WHEN ${leads.hasOptedIn} = 1 THEN 1 ELSE 0 END)`,
      leads: count(),
    })
      .from(leads)
      .innerJoin(universities, eq(leads.universityId, universities.id))
      .groupBy(sql`strftime('%Y-%m', ${leads.createdAt})`)
      .orderBy(sql`strftime('%Y-%m', ${leads.createdAt}) DESC`)
      .limit(6)
      .all(),
  ]);

  // School demand: parse ai_results JSON from students
  let schoolDemand: Array<{ schoolSlug: string; count: number; avgProbability: number }> = [];
  try {
    const raw = await db.all<{ school_slug: string; demand_count: number; avg_probability: number }>(sql`
      SELECT
        json_extract(m.value, '$.university_slug') AS school_slug,
        COUNT(*) AS demand_count,
        AVG(CAST(json_extract(m.value, '$.probability') AS REAL)) AS avg_probability
      FROM students s, json_each(json_extract(s.ai_results, '$.matches')) m
      WHERE s.ai_results IS NOT NULL
        AND s.ai_results != 'null'
        AND json_extract(m.value, '$.university_slug') IS NOT NULL
      GROUP BY json_extract(m.value, '$.university_slug')
      ORDER BY demand_count DESC
      LIMIT 15
    `);
    schoolDemand = raw.map((r) => ({
      schoolSlug: r.school_slug,
      count: r.demand_count,
      avgProbability: Math.round((r.avg_probability ?? 0) * 100),
    }));
  } catch (_) {
    // ai_results column may be empty in dev
  }

  const total = totalStudents?.count ?? 0;
  const leadsCount = totalLeads?.count ?? 0;
  const optIns = totalOptIns?.count ?? 0;
  const converted = totalConverted?.count ?? 0;

  const consentCount = consentPrivateLeads?.count ?? 0;
  const avgGrade = avgGradeResult?.avg ? Math.round(parseFloat(String(avgGradeResult.avg)) * 10) / 10 : 0;

  return c.json({
    funnel: {
      simulations: total,
      leads: leadsCount,
      optIns,
      contacts: totalWithContact?.count ?? 0,
      converted,
      consentPrivate: consentCount,
      consentRate: total ? Math.round((consentCount / total) * 100) : 0,
      simToLead: total ? Math.round((leadsCount / total) * 100) : 0,
      leadToOptIn: leadsCount ? Math.round((optIns / leadsCount) * 100) : 0,
      optInToConverted: optIns ? Math.round((converted / optIns) * 100) : 0,
    },
    todaySimulations: todaySimulations?.count ?? 0,
    avgGrade,
    schoolDemand,
    mentionDist,
    trackDist: trackDist.map((t) => ({
      bacTrack: t.bacTrack,
      count: t.count,
      avgGrade: t.avgGrade ? Math.round(parseFloat(String(t.avgGrade)) * 10) / 10 : 0,
    })),
    regionDist,
    budgetDist,
    trend30d,
    recentProfiles,
    leadStatusDist,
    monthlyRevenue: monthlyRevenue.reverse(),
  });
});

export default app;
