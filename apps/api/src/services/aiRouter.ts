import { hashString, parseEvaluationResponse, type EvaluationResponse } from "@tawjih/ai";
import { buildEvaluationPrompt } from "@tawjih/ai";
import { aiLogs } from "@tawjih/shared";
import { drizzle } from "drizzle-orm/d1";
import type { Env } from "../types/env";

interface AiRouterOptions {
  bacTrack: string;
  generalGrade: number;
  mention: string;
  city: string;
  universitiesJSON: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

interface OpenRouterResponse {
  choices?: Array<{
    message?: { content?: string };
  }>;
}

const FALLBACK_RESPONSE: EvaluationResponse = {
  matches: [],
  alternatives: [
    { name: "Université Publique de votre ville", type: "public", reason: "Accessible sans condition de seuil élevé" },
    { name: "ISTA / OFPPT — Formation professionnelle", type: "vocational", reason: "Alternance rémunérée et insertion rapide" },
    { name: "Classes Préparatoires (CPGE)", type: "public", reason: "Si vous visez les grandes écoles d'ingénieurs" },
  ],
  anonymized_summary: "Profil nécessitant une orientation approfondie. Consultez un conseiller.",
  suggested_tracks: ["Sciences de l'ingénieur", "Commerce", "Informatique"],
};

export async function evaluateWithAi(env: Env, options: AiRouterOptions): Promise<EvaluationResponse> {
  const prompt = buildEvaluationPrompt(options);
  const cacheKey = `eval:${await hashString(prompt + "evaluate")}`;

  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    await logAi(env, { modelUsed: "cache", latencyMs: 0, status: "cached", cached: true });
    return JSON.parse(cached) as EvaluationResponse;
  }

  let result: EvaluationResponse | null = null;
  let status: "success" | "fallback" | "error" = "error";
  let modelUsed = "";
  let latencyMs = 0;
  let errorMessage: string | null = null;

  // Primary: Gemini 2.5 Flash
  try {
    const start = Date.now();
    const geminiRes = await fetchGemini(env.GEMINI_API_KEY, prompt);
    latencyMs = Date.now() - start;
    result = parseEvaluationResponse(geminiRes);
    status = "success";
    modelUsed = "gemini-2.5-flash";
  } catch (err) {
    errorMessage = `Gemini failed: ${String(err)}`;

    // Fallback: OpenRouter
    try {
      const start = Date.now();
      const openRes = await fetchOpenRouter(env.OPENROUTER_API_KEY, prompt);
      latencyMs = Date.now() - start;
      result = parseEvaluationResponse(openRes);
      status = "fallback";
      modelUsed = "openrouter-llama-3-8b";
      errorMessage = null;
    } catch (err2) {
      errorMessage += ` | OpenRouter failed: ${String(err2)}`;
    }
  }

  await logAi(env, { modelUsed: modelUsed || "none", latencyMs, status, errorMessage, cached: false });

  if (!result) {
    const genericCache = await env.CACHE.get("eval:generic");
    if (genericCache) {
      return JSON.parse(genericCache) as EvaluationResponse;
    }
    return FALLBACK_RESPONSE;
  }

  await env.CACHE.put(cacheKey, JSON.stringify(result), { expirationTtl: 7200 });
  return result;
}

async function fetchGemini(apiKey: string, prompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
      signal: controller.signal,
    }
  );
  clearTimeout(timeout);

  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = (await res.json()) as GeminiResponse;
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function fetchOpenRouter(apiKey: string, prompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://tawjih.ai",
      "X-Title": "TAWJIH.AI",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3-8b-instruct:free",
      messages: [
        { role: "system", content: "Tu es TAWJIH.AI. Retourne UNIQUEMENT du JSON valide." },
        { role: "user", content: prompt },
      ],
    }),
    signal: controller.signal,
  });
  clearTimeout(timeout);

  if (!res.ok) throw new Error(`OpenRouter HTTP ${res.status}`);
  const data = (await res.json()) as OpenRouterResponse;
  return data.choices?.[0]?.message?.content ?? "";
}

async function logAi(
  env: Env,
  opts: {
    modelUsed: string;
    latencyMs: number;
    status: "success" | "fallback" | "error" | "cached";
    errorMessage?: string | null;
    cached: boolean;
  }
) {
  const db = drizzle(env.DB);
  await db.insert(aiLogs).values({
    modelUsed: opts.modelUsed,
    latencyMs: opts.latencyMs,
    status: opts.status,
    errorMessage: opts.errorMessage || null,
    cached: opts.cached,
  });
}
