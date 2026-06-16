import { Hono } from "hono";
import { z } from "zod";
import { validate } from "../../middleware/validate";
import type { Env } from "../../types/env";

type PlatformContext = {
  funnel?: {
    simulations: number; leads: number; optIns: number;
    contacts: number; converted: number;
    simToLead: number; leadToOptIn: number; optInToConverted: number;
  };
  schoolDemand?: Array<{ schoolSlug: string; count: number; avgProbability: number }>;
  trackDist?: Array<{ bacTrack: string; count: number; avgGrade: number }>;
  regionDist?: Array<{ region: string; count: number }>;
  budgetDist?: Array<{ bracket: string; count: number }>;
  trend30d?: Array<{ day: string; count: number }>;
  mentionDist?: Array<{ mention: string; count: number }>;
  monthlyRevenue?: Array<{ month: string; revenue: number; optIns: number; leads: number }>;
};

const assistantSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(20)
    .default([]),
  context: z.record(z.unknown()).optional(),
});

function buildSystemPrompt(ctx?: PlatformContext): string {
  const today = new Date().toLocaleDateString("fr-MA", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const lines: string[] = [];

  if (ctx?.funnel) {
    const f = ctx.funnel;
    lines.push("ENTONNOIR DE CONVERSION :");
    lines.push(`  Simulations : ${f.simulations} | Leads : ${f.leads} (${f.simToLead}% sim→lead)`);
    lines.push(`  Opt-ins : ${f.optIns} (${f.leadToOptIn}% lead→opt-in) | Convertis : ${f.converted} (${f.optInToConverted}% opt-in→converti)`);
  }

  if (ctx?.trackDist?.length) {
    lines.push("FILIÈRES BAC (top 5) :");
    ctx.trackDist.slice(0, 5).forEach(t =>
      lines.push(`  ${t.bacTrack} : ${t.count} étudiants, moy. ${t.avgGrade?.toFixed(1) ?? "?"}/20`)
    );
  }

  if (ctx?.regionDist?.length) {
    lines.push("RÉGIONS (top 5) :");
    ctx.regionDist.slice(0, 5).forEach(r => lines.push(`  ${r.region} : ${r.count} profils`));
  }

  if (ctx?.budgetDist?.length) {
    lines.push("TRANCHES BUDGÉTAIRES :");
    ctx.budgetDist.forEach(b => lines.push(`  ${b.bracket} MAD/an : ${b.count} étudiants`));
  }

  if (ctx?.schoolDemand?.length) {
    lines.push("ÉCOLES LES PLUS DEMANDÉES :");
    ctx.schoolDemand.slice(0, 5).forEach(s =>
      lines.push(`  ${s.schoolSlug} : ${s.count} demandes (match moy. ${((s.avgProbability ?? 0) * 100).toFixed(0)}%)`)
    );
  }

  if (ctx?.mentionDist?.length) {
    lines.push("NIVEAUX SCOLAIRES :");
    ctx.mentionDist.forEach(m => lines.push(`  ${m.mention} : ${m.count}`));
  }

  if (ctx?.monthlyRevenue?.length) {
    const total = ctx.monthlyRevenue.reduce((s, m) => s + (m.revenue ?? 0), 0);
    lines.push(`REVENUS CUMULÉS : ${total.toLocaleString("fr-MA")} MAD`);
    ctx.monthlyRevenue.slice(-3).forEach(m =>
      lines.push(`  ${m.month} : ${(m.revenue ?? 0).toLocaleString("fr-MA")} MAD (${m.optIns} opt-ins, ${m.leads} leads)`)
    );
  }

  if (ctx?.trend30d?.length) {
    const last7 = ctx.trend30d.slice(-7);
    const avg = last7.reduce((s, d) => s + d.count, 0) / last7.length;
    const yesterday = ctx.trend30d[ctx.trend30d.length - 1];
    lines.push(`TENDANCE 30J : moy. 7j = ${avg.toFixed(1)} sim/jour${yesterday ? `, hier = ${yesterday.count}` : ""}`);
  }

  const dataSection = lines.length
    ? lines.join("\n")
    : "Aucune donnée dashboard disponible. Demande à l'admin de recharger la page.";

  return `Tu es l'assistant IA de JAD2 TAWJIH, la plateforme marocaine d'orientation académique pour lycéens.
Tu assistes Hamza ElBouhali (fondateur et administrateur) dans le pilotage business et l'analyse des données.

DATE : ${today}

══ DONNÉES EN TEMPS RÉEL ══
${dataSection}

══ TES CAPACITÉS ══
1. ANALYSE — Interprète les métriques, identifie les tendances et anomalies de conversion
2. EMAILS — Rédige des emails professionnels (partenariats écoles, relances, rapports investisseurs)
3. STRATÉGIE — Propose des actions concrètes basées sur les données ci-dessus
4. RAPPORT — Synthétise la performance en bullet points actionnables

══ RÈGLES ══
- Sois concis, direct, professionnel (ton B2B marocain)
- Utilise des bullet points et le **gras** pour la clarté
- Pour les emails : encadre avec ---EMAIL--- et ---FIN EMAIL---
- Si tu détectes une anomalie (taux <5%, chute soudaine, etc.) : commence par ⚠️ ALERTE
- Cite toujours les chiffres exacts des données injectées
- Réponds en français sauf si l'utilisateur écrit en arabe ou en anglais`;
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  error?: { message?: string };
}

const app = new Hono<{ Bindings: Env }>();

app.post("/", validate("json", assistantSchema), async (c) => {
  const { message, history, context } = c.req.valid("json");

  const systemPrompt = buildSystemPrompt(context as PlatformContext | undefined);

  const contents = [
    ...history.slice(-14),
    { role: "user" as const, content: message },
  ].map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const geminiPayload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { temperature: 0.4, maxOutputTokens: 1500 },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${c.env.GEMINI_API_KEY}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(geminiPayload) }
  );

  const data = (await res.json()) as GeminiResponse;

  if (data.error) {
    return c.json({ error: data.error.message ?? "Erreur API Gemini" }, 502);
  }

  const response = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return c.json({ response });
});

export default app;
