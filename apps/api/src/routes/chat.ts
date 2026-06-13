import { Hono } from "hono";
import type { Env } from "../types/env";
import { rateLimit } from "../middleware/rateLimit";

interface ChatMessage {
  role: "user" | "slimane";
  content: string;
}

interface OpenRouterResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

const SYSTEM_PROMPT = `Tu es Slimane, conseiller académique IA expert de l'enseignement supérieur au Maroc, créé par JAD2 Advisory. Tu es chaleureux, direct, précis et bienveillant. Tu parles comme un ami bien informé, pas comme un robot.

Tu connais parfaitement toutes les institutions marocaines : ENSA (13 campus, accès direct bac), EMI / EHTP / ENSIAS / INPT / ENIM (via CPGE 2 ans + CNC uniquement), ENCG (12 campus, concours TAFEM), ISCAE, HEM, UIR, UM6P, Al Akhawayn, IAV Hassan II, ENA (architecture — Rabat, Casa, Marrakech, Fès, Tétouan), FMP (médecine — 5 villes, seuil ~12/20), UM6SS, ISPITS (paramédical), ISADAC (arts dramatiques), EST/FST/FSJES (universités publiques, accès libre), ENSAM (2 campus), EMSI, ESIG, ESISA, SupDéco.

Règles :
- Réponds TOUJOURS dans la langue de l'utilisateur (FR/AR/EN) — détecte-la automatiquement
- Tu es conversationnel : réponds aux questions de suivi, aux réactions émotionnelles, aux métaphores
- Si on te demande ton modèle / qui tu es : "Je suis Slimane, conseiller IA de JAD2 Advisory, spécialisé dans l'orientation académique au Maroc."
- Si la question porte sur les salaires / si ça paie bien : donne des fourchettes réelles en MAD/mois
- Si la question est hors sujet académique (politique, religion, actualité) : réponds brièvement avec humour et redirige
- Maximum 120 mots par réponse, sauf question complexe (max 200)
- Utilise → pour les listes et ** pour les termes clés
- Ne commence jamais par "Je n'ai pas bien saisi"`;

const app = new Hono<{ Bindings: Env }>();

app.use(rateLimit("chat"));

app.post("/", async (c) => {
  let body: { messages: ChatMessage[]; lang?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  if (!body.messages?.length) return c.json({ error: "messages required" }, 400);

  const history = body.messages.slice(-10);

  // Primary: OpenRouter free Llama 3.1 8B
  try {
    const reply = await fetchOpenRouterChat(c.env.OPENROUTER_API_KEY, history);
    if (reply) return c.json({ reply: reply.trim() });
  } catch { /* fall through to Gemini */ }

  // Fallback: Gemini 2.5 Flash
  try {
    const reply = await fetchGeminiChat(c.env.GEMINI_API_KEY, history);
    if (reply) return c.json({ reply: reply.trim() });
  } catch { /* fall through */ }

  return c.json({ reply: null });
});

async function fetchOpenRouterChat(apiKey: string, messages: ChatMessage[]): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://tawjih.ai",
        "X-Title": "Slimane - JAD2 Advisory",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({
            role: m.role === "slimane" ? "assistant" : "user",
            content: m.content,
          })),
        ],
        max_tokens: 300,
        temperature: 0.75,
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
    const data = (await res.json()) as OpenRouterResponse;
    return data.choices?.[0]?.message?.content ?? null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchGeminiChat(apiKey: string, messages: ChatMessage[]): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const contents = messages.map((m) => ({
      role: m.role === "slimane" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 300, temperature: 0.75 },
        }),
        signal: controller.signal,
      }
    );
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = (await res.json()) as GeminiResponse;
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } finally {
    clearTimeout(timer);
  }
}

export default app;
