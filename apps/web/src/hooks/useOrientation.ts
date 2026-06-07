import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "/api";

interface EvaluatePayload {
  bacTrack: string;
  mathGrade?: number;
  physicsGrade?: number;
  generalGrade: number;
  city: string;
  region: string;
  financialBracket: string;
  interestsVector?: number[];
  turnstileToken: string;
  consent: true;
}

export function useEvaluate() {
  return useMutation({
    mutationFn: async (payload: EvaluatePayload) => {
      const res = await fetch(`${API_URL}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Evaluation failed");
      }
      return res.json() as Promise<{
        studentUuid: string;
        matches: Array<{
          university_slug: string;
          probability: number;
          confidence: string;
          rationale: string;
          estimated_annual_cost_mad: number;
        }>;
        alternatives: Array<{ name: string; type: string; reason: string }>;
        suggested_tracks: string[];
      }>;
    },
  });
}
