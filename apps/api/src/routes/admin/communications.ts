import { Hono } from "hono";
import { z } from "zod";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import type { Env } from "../../types/env";

const draftSchema = z.object({
  leadUuid: z.string().uuid(),
  channel: z.enum(["email", "sms"]),
  tone: z.enum(["formal", "friendly"]),
  universityName: z.string().min(1),
  deanName: z.string().min(1),
});

const app = new Hono<{ Bindings: Env }>();

app.post("/", auth("dean"), validate("json", draftSchema), async (c) => {
  const body = c.req.valid("json");

  const systemPrompt = `Tu es TAWJIH.AI Assistant, un rédacteur de communications pour les doyens d'universités privées marocaines.
RÈGLES:
- Rédige en français professionnel.
- Ton: ${body.tone === "formal" ? "formel et professionnel" : "chaleureux et accessible"}.
- Canal: ${body.channel === "email" ? "email structuré avec sujet et corps" : "SMS concis (< 160 caractères)"}.
- Signataire: ${body.deanName}, ${body.universityName}.

FORMAT JSON STRICT:
{
  "subject": string,
  "body": string,
  "call_to_action": string
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${c.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) {
    return c.json({ error: "AI generation failed" }, 502);
  }

  interface GeminiResponse {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  }

  const data = (await res.json()) as GeminiResponse;
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

  let parsed: { subject?: string; body?: string; call_to_action?: string };
  try {
    parsed = JSON.parse(raw.replace(/^```json\s*/, "").replace(/```\s*$/, "").trim());
  } catch {
    parsed = { subject: "Votre orientation avec TAWJIH.AI", body: raw, call_to_action: "Répondre pour fixer un rendez-vous" };
  }

  return c.json({
    channel: body.channel,
    subject: parsed.subject ?? "Votre orientation avec TAWJIH.AI",
    body: parsed.body ?? raw,
    callToAction: parsed.call_to_action ?? "Répondre pour fixer un rendez-vous",
  });
});

export default app;
