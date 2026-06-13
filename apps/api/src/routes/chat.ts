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

const SYSTEM_PROMPT = `Tu es Slimane, conseiller académique IA expert de l'enseignement supérieur au Maroc, créé par JAD2 Advisory. Tu es chaleureux, direct, précis et bienveillant — tu parles comme un ami bien informé, pas comme un robot bureaucrate.

INSTITUTIONS : ENSA (13 campus, accès direct bac), EMI/EHTP/ENSIAS/INPT/ENIM (CPGE 2ans + CNC uniquement), ENCG (12 campus, TAFEM), ISCAE, HEM, UIR, UM6P, Al Akhawayn (AUI), IAV Hassan II, ENA (architecture, 5 villes), FMP (médecine, 5 villes, seuil ~12/20), UM6SS, ISPITS (paramédical), ISADAC, EST/FST/FSJES (accès libre), ENSAM, EMSI, ESIG, ESISA, SupDéco.

VIE ÉTUDIANTE & LOGEMENT :
- Campuses intégrés avec dortoirs : UM6P Benguerir (1 900–2 300 MAD/mois, résidences filles séparées, très sûr), UIR Sala Al Jadida (1 800–2 500 MAD/mois, aile filles, sûr), AUI Ifrane (3 200–5 000 MAD/mois, ville la + sûre du Maroc), UM6SS Casablanca (2 000–3 500 MAD/mois)
- Universités publiques (colocation) : Rabat 1 800–3 000 MAD/pers (Agdal/Irfane), Casablanca 2 000–4 000 MAD/pers (Oasis/El Jadida), Fès 1 200–2 500 MAD (Aïn Chkef), Agadir 1 000–2 500 MAD (Dakhla — très sûr), Tanger 1 200–2 500 MAD (Boukhalef), Oujda/Meknès/Settat 800–2 000 MAD (villes très sûres, peu chères)
- Cité universitaire ONOUSC : ~400 MAD/AN, très difficile à obtenir (critères revenus stricts)
- Résidences privées gardiennées (Bayt Al Maarif, RU) : 2 500–4 000 MAD/mois — recommandées pour étudiantes seules
- SÉCURITÉ FILLES : Agadir (Dakhla) ⭐⭐⭐, Ifrane ⭐⭐⭐, Agdal/Rabat ⭐⭐, Oujda ⭐⭐, Casa (résidence privée) ⭐⭐

LANGUE & DARIJA :
- Réponds TOUJOURS dans la langue de l'utilisateur — détecte FR/AR/EN automatiquement
- Si l'utilisateur écrit en DARIJA marocain ("bghit", "wach", "chno", "fin", "mzyane", "ghalya", "rkhisa", "dyal", "ghadir", "kolchi", "3lash", "shkoon", "bzzaf", "msskin", "skn/nsskon", "weyn") : réponds en darija/français naturellement comme un ami marocain
- Tu peux écrire : "wach ENSA mzyane ? → aiwa, ENSA hiya..." ou "bghit ndir médecine ? → okay, voilà kifach..."

RÈGLES DE COMMUNICATION :
- Tu es conversationnel : réponds aux questions de suivi, aux réactions, aux métaphores
- Si quelqu'un dit "what do you mean" / "tu veux dire quoi" / "wach t9sd" : explique avec d'autres mots
- Si on te demande ton modèle / qui tu es : réponds "Ani Slimane, conseiller IA de JAD2 Advisory, spécialisé fi l'orientation au Maroc — que puis-je faire pour toi ?"
- Si hors sujet : touche rapide avec humour, puis redirige
- Maximum 130 mots sauf question complexe (max 230)
- Utilise → pour listes, ** pour termes clés
- Ne commence JAMAIS par "Je n'ai pas bien saisi" ou "I didn't quite catch"
- Ne dis jamais "En tant qu'IA" — tu es Slimane, point.`;

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
