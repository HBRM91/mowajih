import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { students } from "@tawjih/shared";
import { evaluateWithAi } from "../services/aiRouter";
import { hybridMatch, saveMatches } from "../services/matcher";
import { validate } from "../middleware/validate";
import { rateLimit } from "../middleware/rateLimit";
import { cndpAudit } from "../middleware/cndpAudit";
import type { Env } from "../types/env";

const evaluateSchema = z.object({
  bacTrack: z.enum(["SM", "PC", "SVT", "SE", "SH", "STI", "L"]),
  mathGrade: z.number().min(0).max(20).optional(),
  physicsGrade: z.number().min(0).max(20).optional(),
  generalGrade: z.number().min(0).max(20),
  city: z.enum(["Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir","Oujda","Tétouan","Salé","Meknès"]),
  region: z.string().min(1),
  financialBracket: z.enum(["<<3000","3000-8000","8000-15000",">15000"]),
  interestsVector: z.array(z.number()).optional(),
  turnstileToken: z.string().min(1),
  consent: z.literal(true),
});

const app = new Hono<{ Bindings: Env }>();

app.post("/", rateLimit("evaluate"), validate("json", evaluateSchema), cndpAudit("AI_EVALUATE", "student"), async (c) => {
  const body = c.req.valid("json");

  // Verify Turnstile
  const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: c.env.TURNSTILE_SECRET_KEY,
      response: body.turnstileToken,
    }),
  });
  const turnstileData = (await turnstileRes.json()) as { success: boolean };
  if (!turnstileData.success) {
    return c.json({ error: "Turnstile verification failed" }, 400);
  }

  // Calculate mention
  const mention = computeMention(body.generalGrade);

  // Save student
  const db = drizzle(c.env.DB);
  const retentionExpiry = new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000); // 24 months
  const student = await db
    .insert(students)
    .values({
      bacTrack: body.bacTrack,
      mathGrade: body.mathGrade ?? null,
      physicsGrade: body.physicsGrade ?? null,
      generalGrade: body.generalGrade,
      mention,
      city: body.city,
      region: body.region,
      financialBracket: body.financialBracket,
      interestsVector: body.interestsVector ?? null,
      cndpAnonymizedSummary: `Bac ${body.bacTrack}, ${mention}, ${body.city}`,
      retentionExpiry,
    })
    .returning()
    .get();

  // Hybrid matching
  const { matches, useAi } = await hybridMatch(c.env, {
    bacTrack: body.bacTrack,
    generalGrade: body.generalGrade,
    mention,
    city: body.city,
    interestsVector: body.interestsVector,
  });

  let aiResponse = undefined;
  if (useAi) {
    const universitiesJSON = JSON.stringify(matches.map((m) => ({ slug: m.universitySlug })));
    aiResponse = await evaluateWithAi(c.env, {
      bacTrack: body.bacTrack,
      generalGrade: body.generalGrade,
      mention,
      city: body.city,
      universitiesJSON,
    });
  }

  await saveMatches(c.env, student.uuid, matches, aiResponse);

  return c.json({
    studentUuid: student.uuid,
    matches: aiResponse?.matches ?? matches.map((m) => ({
      university_slug: m.universitySlug,
      probability: m.probability,
      confidence: m.confidence,
      rationale: m.rationale,
      estimated_annual_cost_mad: m.estimatedAnnualCostMad,
    })),
    alternatives: aiResponse?.alternatives ?? [],
    suggested_tracks: aiResponse?.suggested_tracks ?? [],
  });
});

function computeMention(grade: number): "Passable" | "Assez Bien" | "Bien" | "Très Bien" {
  if (grade >= 16) return "Très Bien";
  if (grade >= 14) return "Bien";
  if (grade >= 12) return "Assez Bien";
  return "Passable";
}

export default app;
