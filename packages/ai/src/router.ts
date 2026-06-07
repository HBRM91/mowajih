import { z } from "zod";

const evaluationResponseSchema = z.object({
  matches: z.array(z.object({
    university_slug: z.string(),
    probability: z.number().min(0).max(1),
    confidence: z.enum(["high", "medium", "low"]),
    rationale: z.string(),
    estimated_annual_cost_mad: z.number(),
  })),
  alternatives: z.array(z.object({
    name: z.string(),
    type: z.enum(["public", "private", "vocational"]),
    reason: z.string(),
  })),
  anonymized_summary: z.string().max(180),
  suggested_tracks: z.array(z.string()),
});

export type EvaluationResponse = z.infer<typeof evaluationResponseSchema>;

export function parseEvaluationResponse(raw: string): EvaluationResponse {
  const cleaned = raw.replace(/^```json\s*/, "").replace(/```\s*$/, "").trim();
  const parsed = JSON.parse(cleaned);
  return evaluationResponseSchema.parse(parsed);
}

export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
