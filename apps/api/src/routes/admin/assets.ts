import { Hono } from "hono";
import type { Env } from "../../types/env";
import { adminAuth } from "../../middleware/adminAuth";

const assets = new Hono<{ Bindings: Env }>();

// Protect all asset routes with JWT auth
assets.use("/*", adminAuth());

const GEMINI_MODEL = "gemini-2.0-flash-preview-image-generation";

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}
interface GeminiResponse {
  candidates?: Array<{ content: { parts: GeminiPart[] } }>;
  error?: { message: string; code: number };
}

// POST /api/admin/assets/generate
assets.post("/generate", async (c) => {
  const ip = c.req.header("CF-Connecting-IP") || "unknown";

  // Rate limit: max 20 generations per hour per IP
  const rlKey = `ratelimit:admin:assets:${ip}`;
  const current = await c.env.CACHE.get(rlKey);
  const count = current ? parseInt(current, 10) : 0;
  if (count >= 20) {
    return c.json({ error: "Limite horaire atteinte (20 générations/heure)." }, 429);
  }
  await c.env.CACHE.put(rlKey, String(count + 1), { expirationTtl: 3600 });

  // Validate body
  let body: { prompt?: string; style?: string } = {};
  try { body = await c.req.json(); } catch { return c.json({ error: "Corps invalide." }, 400); }

  const prompt = body.prompt?.trim();
  if (!prompt || prompt.length < 3) return c.json({ error: "Prompt trop court (min 3 caractères)." }, 400);
  if (prompt.length > 500) return c.json({ error: "Prompt trop long (max 500 caractères)." }, 400);

  const fullPrompt = body.style ? `${prompt}. Art style: ${body.style}` : prompt;

  // Call Gemini image generation API
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${c.env.GEMINI_API_KEY}`;

  let geminiRes: Response;
  try {
    geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    });
  } catch (err) {
    return c.json({ error: "Erreur réseau vers Gemini.", detail: String(err) }, 502);
  }

  const data = await geminiRes.json() as GeminiResponse;

  if (!geminiRes.ok || data.error) {
    return c.json(
      { error: "Gemini API error", detail: data.error?.message ?? `HTTP ${geminiRes.status}` },
      502
    );
  }

  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData);
  const textPart = parts.find((p) => p.text);

  if (!imagePart?.inlineData) {
    return c.json({
      error: "Aucune image générée.",
      detail: textPart?.text ?? "Gemini n'a pas retourné d'image.",
    }, 502);
  }

  return c.json({
    imageBase64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
    caption: textPart?.text ?? null,
    prompt: fullPrompt,
  });
});

export default assets;
