import type { Env } from "../types/env";

export async function queryUniversityVector(env: Env, vector: number[], topK = 10) {
  try {
    return await env.VECTORIZE.query(vector, { topK });
  } catch (err) {
    console.error("Vectorize query failed:", err);
    return { matches: [] };
  }
}
