import { describe, it, expect, vi } from "vitest";
import { evaluateWithAi } from "../src/services/aiRouter";
import type { Env } from "../src/types/env";

const createMockEnv = (opts: { cacheValue?: string | null; geminiOk?: boolean; openrouterOk?: boolean }): Env => ({
  DB: {} as D1Database,
  CACHE: {
    get: vi.fn().mockResolvedValue(opts.cacheValue ?? null),
    put: vi.fn().mockResolvedValue(undefined),
  } as unknown as KVNamespace,
  VECTORIZE: {} as VectorizeIndex,
  LEAD_STREAM: {} as DurableObjectNamespace,
  GEMINI_API_KEY: "test-gemini-key",
  OPENROUTER_API_KEY: "test-openrouter-key",
  IP_PEPPER: "pepper",
  TURNSTILE_SECRET_KEY: "test-turnstile",
  CLOUDFLARE_ACCESS_TEAM_DOMAIN: "test.cloudflareaccess.com",
  ENVIRONMENT: "development",
});

describe("evaluateWithAi", () => {
  it("returns cached response when available", async () => {
    const cached = JSON.stringify({
      matches: [],
      alternatives: [],
      anonymized_summary: "cached",
      suggested_tracks: [],
    });

    const env = createMockEnv({ cacheValue: cached });
    const result = await evaluateWithAi(env, {
      bacTrack: "SM",
      generalGrade: 15,
      mention: "Bien",
      city: "Casablanca",
      universitiesJSON: "[]",
    });

    expect(result.anonymized_summary).toBe("cached");
    expect(env.CACHE.get).toHaveBeenCalled();
  });

  it("returns fallback JSON on double failure", async () => {
    const env = createMockEnv({ geminiOk: false, openrouterOk: false });

    // Mock fetch to fail for both providers
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const result = await evaluateWithAi(env, {
      bacTrack: "SM",
      generalGrade: 15,
      mention: "Bien",
      city: "Casablanca",
      universitiesJSON: "[]",
    });

    expect(result.alternatives.length).toBeGreaterThan(0);
    expect(result.anonymized_summary).toContain("orientation");
  });

  it("uses fallback model when Gemini fails but OpenRouter succeeds", async () => {
    const openRouterResponse = {
      matches: [
        {
          university_slug: "uir",
          probability: 0.72,
          confidence: "medium",
          rationale: "Profil compatible",
          estimated_annual_cost_mad: 3120,
        },
      ],
      alternatives: [],
      anonymized_summary: "Bac SM, Assez Bien, Rabat",
      suggested_tracks: ["Ingénierie"],
    };

    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Gemini timeout"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify(openRouterResponse) } }],
        }),
      } as any);

    const env = createMockEnv({});
    const result = await evaluateWithAi(env, {
      bacTrack: "SM",
      generalGrade: 13.5,
      mention: "Assez Bien",
      city: "Rabat",
      universitiesJSON: "[]",
    });

    expect(result.matches[0].university_slug).toBe("uir");
  });
});
