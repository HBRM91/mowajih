import { eq, and, gte, sql } from "drizzle-orm";
import { universities, leads } from "@tawjih/shared";
import { drizzle } from "drizzle-orm/d1";
import type { Env } from "../types/env";
import type { EvaluationResponse } from "@tawjih/ai";

interface MatchInput {
  bacTrack: string;
  generalGrade: number;
  mention: string;
  city: string;
  interestsVector?: number[] | null;
}

interface MatchResult {
  universitySlug: string;
  probability: number;
  confidence: "high" | "medium" | "low";
  rationale: string;
  estimatedAnnualCostMad: number;
  matchType: "rule_based" | "semantic" | "hybrid";
}

export async function hybridMatch(env: Env, input: MatchInput): Promise<{ matches: MatchResult[]; useAi: boolean }> {
  const db = drizzle(env.DB);

  // Rule-based filter: required_seuil <= generalGrade + 1.0 AND bacTracksAccepted includes bacTrack
  const ruleMatches = await db
    .select()
    .from(universities)
    .where(
      and(
        gte(universities.requiredSeuil, input.generalGrade - 2.0),
        gte(sql`${input.generalGrade} + 1.0`, universities.requiredSeuil),
        sql`json_array_length(${universities.bacTracksAccepted}) > 0`
      )
    )
    .all();

  const filtered = ruleMatches.filter((u) => {
    const tracks = u.bacTracksAccepted as string[];
    return tracks.includes(input.bacTrack) || tracks.includes("all");
  });

  if (filtered.length < 3) {
    // Skip AI, return rule results with generic rationale
    const matches: MatchResult[] = filtered.map((u) => ({
      universitySlug: u.slug,
      probability: Math.min(0.95, Math.max(0.1, (input.generalGrade - u.requiredSeuil + 3) / 5)),
      confidence: input.generalGrade >= u.requiredSeuil + 1 ? "high" : input.generalGrade >= u.requiredSeuil ? "medium" : "low",
      rationale: `Seuil requis ${u.requiredSeuil}, votre moyenne est ${input.generalGrade}.`,
      estimatedAnnualCostMad: u.optInCost * 24,
      matchType: "rule_based",
    }));
    return { matches, useAi: false };
  }

  // Semantic boost via Vectorize if interestsVector available
  let semanticBoost: Map<string, number> = new Map();
  if (input.interestsVector && input.interestsVector.length > 0) {
    try {
      const vectorRes = await env.VECTORIZE.query(input.interestsVector, { topK: 10 });
      for (const match of vectorRes.matches) {
        semanticBoost.set(match.id, match.score);
      }
    } catch {
      // Vectorize optional
    }
  }

  const matches: MatchResult[] = filtered.map((u) => {
    const baseProb = Math.min(0.95, Math.max(0.1, (input.generalGrade - u.requiredSeuil + 3) / 5));
    const boost = semanticBoost.get(u.slug) || 0;
    const probability = Math.min(0.99, baseProb + boost * 0.1);
    return {
      universitySlug: u.slug,
      probability,
      confidence: probability >= 0.7 ? "high" : probability >= 0.5 ? "medium" : "low",
      rationale: `Seuil requis ${u.requiredSeuil}, votre moyenne est ${input.generalGrade}.`,
      estimatedAnnualCostMad: u.optInCost * 24,
      matchType: boost > 0 ? "hybrid" : "rule_based",
    };
  });

  return { matches, useAi: true };
}

export async function saveMatches(
  env: Env,
  studentUuid: string,
  matches: MatchResult[],
  aiResponse?: EvaluationResponse
) {
  const db = drizzle(env.DB);

  for (const match of matches) {
    const uni = await db.select({ id: universities.id }).from(universities).where(eq(universities.slug, match.universitySlug)).get();
    if (!uni) continue;

    const aiMatch = aiResponse?.matches.find((m) => m.university_slug === match.universitySlug);

    await db.insert(leads).values({
      studentUuid,
      universityId: uni.id,
      matchProbability: aiMatch?.probability ?? match.probability,
      matchType: match.matchType,
      aiRationale: aiMatch?.rationale ?? match.rationale,
      status: "new",
    });
  }
}
