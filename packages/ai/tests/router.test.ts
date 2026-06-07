import { describe, it, expect } from "vitest";
import { parseEvaluationResponse, hashString } from "../src/router";

describe("parseEvaluationResponse", () => {
  it("parses valid JSON response", () => {
    const raw = JSON.stringify({
      matches: [
        {
          university_slug: "emsi",
          probability: 0.85,
          confidence: "high",
          rationale: "Bon profil technique",
          estimated_annual_cost_mad: 2400,
        },
      ],
      alternatives: [],
      anonymized_summary: "Bac SM, Bien, Casablanca",
      suggested_tracks: ["Informatique"],
    });

    const result = parseEvaluationResponse(raw);
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].university_slug).toBe("emsi");
    expect(result.matches[0].probability).toBe(0.85);
  });

  it("strips markdown code fences", () => {
    const raw = "```json\n" + JSON.stringify({
      matches: [],
      alternatives: [],
      anonymized_summary: "test",
      suggested_tracks: [],
    }) + "\n```";

    const result = parseEvaluationResponse(raw);
    expect(result.anonymized_summary).toBe("test");
  });

  it("throws on invalid JSON", () => {
    expect(() => parseEvaluationResponse("not json")).toThrow();
  });
});

describe("hashString", () => {
  it("returns a consistent SHA-256 hex string", async () => {
    const hash1 = await hashString("test-input");
    const hash2 = await hashString("test-input");
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it("returns different hashes for different inputs", async () => {
    const hash1 = await hashString("input-a");
    const hash2 = await hashString("input-b");
    expect(hash1).not.toBe(hash2);
  });
});
