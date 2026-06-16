import { Hono } from "hono";
import { z } from "zod";
import { adminAuth } from "../../middleware/adminAuth";
import { validate } from "../../middleware/validate";
import type { Env } from "../../types/env";

const KV_KEY = "school_seuils_overrides";

const schoolInputSchema = z.object({
  slug: z.string(),
  name: z.string(),
  shortName: z.string(),
  type: z.string(),
  tracks: z.array(z.string()),
  currentMinGrade: z.number(),
  currentCostMin: z.number(),
  currentCostMax: z.number(),
  admissionType: z.string(),
});

const suggestSchema = z.object({
  schools: z.array(schoolInputSchema).min(1).max(80),
});

const applySchema = z.object({
  updates: z.array(z.object({
    slug: z.string(),
    minGrade: z.number().min(0).max(20).optional(),
    annualCostMin: z.number().min(0).optional(),
    annualCostMax: z.number().min(0).optional(),
    notes: z.string().optional(),
  })).min(1).max(80),
});

const app = new Hono<{ Bindings: Env }>();

// GET — return current KV overrides
app.get("/", adminAuth(), async (c) => {
  const raw = await c.env.CACHE.get(KV_KEY);
  const overrides = raw ? JSON.parse(raw) : { updates: [], updatedAt: null };
  return c.json(overrides);
});

// POST /suggest — call AI to suggest seuil updates
app.post("/suggest", adminAuth(), validate("json", suggestSchema), async (c) => {
  const { schools } = c.req.valid("json");

  const schoolList = schools.map((s) =>
    `- ${s.shortName} (${s.slug}): filières [${s.tracks.join(", ")}], seuil actuel ${s.currentMinGrade}/20, type ${s.type}, admission ${s.admissionType}, frais actuels ${s.currentCostMin}–${s.currentCostMax} MAD/an`
  ).join("\n");

  const prompt = `Tu es un expert en admissions aux grandes écoles et universités marocaines. Je te donne la liste des établissements avec leurs seuils d'admission actuels (données qui peuvent être obsolètes).

En te basant sur les données officielles les plus récentes (sessions 2024-2025 de Tawjihi, cursussup.gov.ma, sites officiels des établissements), génère des suggestions de mise à jour pour les seuils d'admission et les frais de scolarité.

ÉTABLISSEMENTS À ANALYSER:
${schoolList}

RÈGLES:
- Pour les écoles publiques à admission directe Bac (ENSA, ENSAM, médecine, ENA): utilise les seuils officiels 2025 de la formule 75%×nationale + 25%×régionale
- Pour ISCAE: seuils 2025 par filière (SE, SM, SGC, SVT, PC)
- Pour ENCG (réseau TAFEM): seuil de pré-sélection SE/SM 12.00, PC/SVT 14.00
- Pour les écoles privées: frais de scolarité 2025 en MAD/an
- Si tu n'as pas de données fiables pour un établissement, indique confidence "low" et ne suggère pas de changement (garde les valeurs actuelles)

RÉPONDS UNIQUEMENT en JSON valide avec cette structure exacte, sans texte avant ou après:
{
  "suggestions": [
    {
      "slug": "string",
      "currentMinGrade": number,
      "suggestedMinGrade": number,
      "currentCostMin": number,
      "currentCostMax": number,
      "suggestedCostMin": number,
      "suggestedCostMax": number,
      "confidence": "high" | "medium" | "low",
      "source": "string (cursussup.gov.ma / site officiel / etc.)",
      "notes": "string (explication courte)"
    }
  ]
}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${c.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    interface GeminiResp {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    }
    const data = (await res.json()) as GeminiResp;
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let parsed: { suggestions?: unknown[] };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return c.json({ error: "AI returned invalid JSON", raw }, 502);
    }

    return c.json({ suggestions: parsed.suggestions ?? [], generatedAt: new Date().toISOString() });
  } catch (err) {
    return c.json({ error: "AI service error", detail: String(err) }, 502);
  }
});

// POST /apply — persist approved updates to KV
app.post("/apply", adminAuth(), validate("json", applySchema), async (c) => {
  const { updates } = c.req.valid("json");

  const existing = await c.env.CACHE.get(KV_KEY);
  const current: Record<string, unknown> = existing ? JSON.parse(existing) : {};
  const currentUpdates: Array<Record<string, unknown>> = Array.isArray(current.updates) ? current.updates as Array<Record<string, unknown>> : [];

  const updatedMap = new Map(currentUpdates.map((u) => [(u as { slug: string }).slug, u]));
  for (const u of updates) {
    updatedMap.set(u.slug, u);
  }

  const payload = {
    updates: Array.from(updatedMap.values()),
    updatedAt: new Date().toISOString(),
    count: updatedMap.size,
  };

  await c.env.CACHE.put(KV_KEY, JSON.stringify(payload), { expirationTtl: 60 * 60 * 24 * 365 });

  return c.json({ ok: true, count: payload.count, updatedAt: payload.updatedAt });
});

// DELETE /reset — clear all KV overrides
app.delete("/reset", adminAuth(), async (c) => {
  await c.env.CACHE.delete(KV_KEY);
  return c.json({ ok: true });
});

// GET /monitoring/complete — current monitoring status
app.get("/monitoring/complete", adminAuth(), async (c) => {
  const raw = await c.env.CACHE.get("seuils_monitoring_complete");
  if (!raw) return c.json({ complete: false });
  const data = JSON.parse(raw) as { year: number; markedAt: string };
  return c.json({ complete: true, year: data.year, markedAt: data.markedAt });
});

// POST /monitoring/complete — mark seuils season as done (stops daily cron from re-running)
app.post("/monitoring/complete", adminAuth(), async (c) => {
  await c.env.CACHE.put("seuils_monitoring_complete", JSON.stringify({
    year: new Date().getFullYear(),
    markedAt: new Date().toISOString(),
  }), { expirationTtl: 60 * 60 * 24 * 400 }); // 400 days — auto-expires before next season
  return c.json({ ok: true, year: new Date().getFullYear() });
});

// DELETE /monitoring/complete — reset monitoring (re-enables cron for current season)
app.delete("/monitoring/complete", adminAuth(), async (c) => {
  await c.env.CACHE.delete("seuils_monitoring_complete");
  return c.json({ ok: true });
});

export default app;
