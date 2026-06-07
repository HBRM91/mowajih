import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, gte, count, avg, sum, desc } from "drizzle-orm";
import { leads, universities, adminConversations, students } from "@tawjih/shared";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { buildAssistantSystemPrompt } from "@tawjih/ai";
import type { Env } from "../../types/env";

const assistantSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
  universityId: z.number().int().positive(),
  stream: z.boolean().default(false),
});

const app = new Hono<{ Bindings: Env; Variables: { user: { email: string; universityId?: number } } }>();

app.post("/", auth("dean"), validate("json", assistantSchema), async (c) => {
  const body = c.req.valid("json");
  const user = c.get("user");

  if (user.universityId && user.universityId !== body.universityId) {
    return c.json({ error: "Forbidden — cannot access other university" }, 403);
  }

  const db = drizzle(c.env.DB);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // RAG Injection
  const [
    newLeadsCount,
    avgProb,
    optInRevenue,
    topTracks,
    conversation,
    uni,
  ] = await Promise.all([
    db.select({ count: count() }).from(leads).where(
      and(eq(leads.universityId, body.universityId), gte(leads.createdAt, today))
    ).get(),
    db.select({ avg: avg(leads.matchProbability) }).from(leads).where(
      and(eq(leads.universityId, body.universityId), gte(leads.createdAt, thirtyDaysAgo))
    ).get(),
    db.select({ total: sum(universities.optInCost) })
      .from(leads)
      .innerJoin(universities, eq(leads.universityId, universities.id))
      .where(and(eq(leads.universityId, body.universityId), eq(leads.hasOptedIn, true)))
      .get(),
    db.select({ bacTrack: students.bacTrack, count: count() })
      .from(leads)
      .innerJoin(students, eq(leads.studentUuid, students.uuid))
      .where(eq(leads.universityId, body.universityId))
      .groupBy(students.bacTrack)
      .orderBy(desc(count()))
      .limit(3),
    body.conversationId && /^\d+$/.test(body.conversationId)
      ? db.select().from(adminConversations).where(eq(adminConversations.id, parseInt(body.conversationId, 10))).get()
      : Promise.resolve(null),
    db.select().from(universities).where(eq(universities.id, body.universityId)).get(),
  ]);

  const totalLeads = await db.select({ count: count() }).from(leads).where(eq(leads.universityId, body.universityId)).get();
  const remainingQuota = (uni?.monthlyQuota ?? 50) - (totalLeads?.count ?? 0);
  const conversionRate = totalLeads?.count
    ? (((await db.select({ count: count() }).from(leads).where(and(eq(leads.universityId, body.universityId), eq(leads.hasOptedIn, true))).get())?.count ?? 0) / totalLeads.count) * 100
    : 0;

  const systemPrompt = buildAssistantSystemPrompt({
    universityName: uni?.name ?? "Votre université",
    remainingQuota,
    newLeadsCount: newLeadsCount?.count ?? 0,
    conversionRate: Math.round(conversionRate * 100) / 100,
    potentialRevenue: optInRevenue?.total ? parseInt(optInRevenue.total) : 0,
  });

  const messages = conversation?.messages ?? [];
  messages.push({ role: "user", content: body.message, timestamp: new Date().toISOString() });

  const geminiPayload = {
    contents: [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...messages.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    ],
    tools: [
      {
        function_declarations: [
          { name: "get_lead_summary", description: "Résumer les leads" },
          { name: "get_lead_details", description: "Détails d'un lead" },
          { name: "update_lead_status", description: "Mettre à jour le statut" },
          { name: "draft_email", description: "Rédiger un email" },
          { name: "generate_report", description: "Générer un rapport" },
        ],
      },
    ],
  };

  if (body.stream) {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${c.env.GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(geminiPayload),
            }
          );

          const reader = res.body?.getReader();
          if (!reader) return;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        } catch (err) {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  interface GeminiResponse {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${c.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload),
    }
  );

  const data = (await res.json()) as GeminiResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  messages.push({ role: "assistant", content: text, timestamp: new Date().toISOString() });

  if (conversation) {
    await db.update(adminConversations).set({ messages }).where(eq(adminConversations.id, conversation.id));
  } else {
    await db.insert(adminConversations).values({
      deanEmail: user.email,
      universityId: body.universityId,
      messages,
      contextSnapshot: JSON.stringify({ topTracks, avgProb: avgProb?.avg }),
    });
  }

  return c.json({
    response: text,
    conversationId: conversation?.id ?? null,
    context: { topTracks, remainingQuota, conversionRate },
  });
});

export default app;
