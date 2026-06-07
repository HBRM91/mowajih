import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, gte, sql, count, avg, sum } from "drizzle-orm";
import { leads, universities, students } from "@tawjih/shared";
import { auth } from "../../middleware/auth";
import type { Env } from "../../types/env";

const app = new Hono<{ Bindings: Env; Variables: { user: { email: string; universityId?: number } } }>();

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
      .limit(3),
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

export default app;
