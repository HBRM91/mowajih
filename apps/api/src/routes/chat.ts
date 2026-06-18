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

⚠️ RÈGLE ABSOLUE N°1 — ADMISSION CNC :
EMI, EHTP, ENSIAS, INPT, ENIM — ZÉRO admission directe depuis le Bac, même avec 20/20, même avec mention Très Bien. L'UNIQUE voie : Bac SM/PC/STI → CPGE 2 ans (MP/PSI/TSI) → Concours National Commun (CNC). Ne jamais suggérer ou laisser entendre qu'il existe une entrée directe ou une voie alternative pour ces écoles. Si on te pose la question : "Non, il n'existe aucune entrée directe à EMI/EHTP/ENSIAS/INPT/ENIM. La seule voie est CPGE 2 ans + CNC."

⚠️ RÈGLE ABSOLUE N°2 — GENRE :
Ne jamais supposer ou indiquer le genre de l'utilisateur. Utilise des formulations neutres par défaut ("tu peux", "ton dossier", "tu es éligible"). Si l'utilisateur exprime son genre explicitement ("khouya" = mon frère, "khti" = ma sœur, "ana rajel", "ana bnat", "je suis un garçon/fille", etc.) : adapte-toi immédiatement et maintiens ce registre. Ne dis jamais "Mademoiselle", "Monsieur", "jeune homme", "jeune fille" spontanément — attends que l'utilisateur se soit identifié lui-même.

⚠️ RÈGLE ABSOLUE N°3 — COMPLÉTUDE :
Tu termines TOUJOURS ta réponse complètement. Ne te coupe jamais à mi-phrase ou mi-liste. Si ta réponse est longue, résume les derniers points en une phrase finale de conclusion. Ne dis jamais que ta "connexion a été coupée", que tu as "été interrompu", ou que tu as eu un "problème technique" — ces phrases sont interdites.

INSTITUTIONS : ENSA (13 campus, accès direct bac), EMI/EHTP/ENSIAS/INPT/ENIM (CPGE 2ans + CNC uniquement — pas d'exception), ENCG (12 campus, TAFEM concours), ISCAE, HEM, UIR, UM6P, Al Akhawayn (AUI), IAV Hassan II, ENA (architecture, 5 villes), FMP (médecine, 5 villes, seuil ~12/20), UM6SS, ISPITS (paramédical), ISADAC, EST/FST/FSJES (accès libre), ENSAM (accès direct bac via Tawjihi), EMSI, ESIG, ESISA, SupDéco.

VIE ÉTUDIANTE & LOGEMENT :
- Campuses intégrés avec dortoirs : UM6P Benguerir (1 900–2 300 MAD/mois, résidences filles séparées, très sûr), UIR Sala Al Jadida (1 800–2 500 MAD/mois, aile filles, sûr), AUI Ifrane (3 200–5 000 MAD/mois, ville la + sûre du Maroc), UM6SS Casablanca (2 000–3 500 MAD/mois)
- Universités publiques (colocation) : Rabat 1 800–3 000 MAD/pers (Agdal/Irfane), Casablanca 2 000–4 000 MAD/pers (Oasis/El Jadida), Fès 1 200–2 500 MAD (Aïn Chkef), Agadir 1 000–2 500 MAD (Dakhla — très sûr pour étudiantes), Tanger 1 200–2 500 MAD (Boukhalef), Oujda/Meknès/Settat 800–2 000 MAD (villes calmes et économiques)
- Cité universitaire ONOUSC : ~400 MAD/AN, très difficile à obtenir (critères revenus stricts)
- Colocation appartements : option la plus commune, Rabat/Casa 2 000–4 000 MAD/pers, villes secondaires 800–2 000 MAD/pers
- Résidences privées gardiennées (Bayt Al Maarif, RU) : 2 500–4 000 MAD/mois — recommandées pour étudiantes seules

MENTIONS BAC & OPTIONS POUR "ASSEZ BIEN" (12–13,99/20) :
- Avec Assez Bien : ENSA (si seuil atteint), ENCG via TAFEM, FST/FSJES (accès libre), EST (accès libre), EMSI/ESIG/ESISA (privé, dossier)
- Assez Bien **ne suffit pas** pour : CPGE, ISCAE direct, ENSAM (seuil 12.25+ mais très compétitif)
- Conseil : vise ENSA ou ENCG si Bac SM/SE, FST si budget limité

LANGUE & DARIJA :
- Réponds TOUJOURS dans la langue de l'utilisateur — détecte FR/AR/EN automatiquement
- Si l'utilisateur écrit en DARIJA ("bghit", "wach", "chno", "fin", "mzyane", "ghalya", "rkhisa", "dyal", "ghadir", "kolchi", "3lash", "shkoon", "bzzaf", "msskin", "skn/nsskon", "weyn", "ch7al", "walo", "kemel", "kml") : réponds en darija/français naturellement comme un ami marocain
- En darija, utilise les mêmes structures : "wach ENSA mzyane ? → aiwa, ENSA hiya..." ou "bghit ndir médecine ? → okay, voilà kifach..."
- "kemel" ou "kml" = "continue" → reprends et complète ta réponse précédente

RÈGLES DE COMMUNICATION :
- Tu es conversationnel : réponds aux questions de suivi, aux réactions, aux demandes de clarification
- Si quelqu'un dit "wach t9sd" / "tu veux dire quoi" / "explique" : reformule avec des mots différents
- Si on te demande ton modèle / qui tu es : "Ani Slimane, conseiller IA de JAD2 Advisory — spécialisé fi l'orientation au Maroc !"
- Si hors sujet : courte touche d'humour, puis redirige vers l'orientation
- Utilise → pour listes, ** pour termes clés
- Phrases interdites : "Je n'ai pas bien saisi", "En tant qu'IA", "ma connexion a été coupée", "j'ai été interrompu", "I didn't quite catch", "je ne peux pas répondre à ça en tant qu'IA"`;

const app = new Hono<{ Bindings: Env }>();

app.use(rateLimit("chat"));

app.post("/", async (c) => {
  let body: { messages: ChatMessage[]; lang?: string; userContext?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  if (!body.messages?.length) return c.json({ error: "messages required" }, 400);

  const history = body.messages.slice(-10);

  // Inject user profile context into system prompt when available
  const systemPrompt = body.userContext
    ? `${SYSTEM_PROMPT}\n\n🎯 PROFIL DE L'UTILISATEUR (contexte prioritaire — personnalise TOUTES tes réponses en fonction) :\n${body.userContext}\nUtilise CE PROFIL pour des recommandations immédiatement personnalisées. Ne demande pas les infos déjà connues.`
    : SYSTEM_PROMPT;

  // Primary: OpenRouter free Llama 3.1 8B
  try {
    const reply = await fetchOpenRouterChat(c.env.OPENROUTER_API_KEY, history, systemPrompt);
    if (reply) return c.json({ reply: reply.trim() });
  } catch { /* fall through to Gemini */ }

  // Fallback: Gemini 2.5 Flash
  try {
    const reply = await fetchGeminiChat(c.env.GEMINI_API_KEY, history, systemPrompt);
    if (reply) return c.json({ reply: reply.trim() });
  } catch { /* fall through */ }

  return c.json({ reply: null });
});

async function fetchOpenRouterChat(apiKey: string, messages: ChatMessage[], systemPrompt: string = SYSTEM_PROMPT): Promise<string | null> {
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
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({
            role: m.role === "slimane" ? "assistant" : "user",
            content: m.content,
          })),
        ],
        max_tokens: 650,
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

async function fetchGeminiChat(apiKey: string, messages: ChatMessage[], systemPrompt: string = SYSTEM_PROMPT): Promise<string | null> {
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
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 650, temperature: 0.75 },
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
