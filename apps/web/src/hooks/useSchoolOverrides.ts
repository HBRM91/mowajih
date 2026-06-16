import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../lib/api";
import { SCHOOLS } from "../data/schools";
import type { School } from "../data/schools";

interface SeuilOverride {
  slug: string;
  minGrade?: number;
  annualCostMin?: number;
  annualCostMax?: number;
  notes?: string;
}

interface SeuilResponse {
  updates: SeuilOverride[];
  updatedAt: string | null;
}

export function useSchoolOverrides() {
  return useQuery<SeuilResponse>({
    queryKey: ["school-seuils"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/public/seuils`);
      if (!res.ok) return { updates: [], updatedAt: null };
      return res.json() as Promise<SeuilResponse>;
    },
    staleTime: 1000 * 60 * 30,
    retry: false,
  });
}

export function applyOverrides(schools: School[], overrides: SeuilOverride[]): School[] {
  if (!overrides.length) return schools;
  const map = new Map(overrides.map((o) => [o.slug, o]));
  return schools.map((school) => {
    const override = map.get(school.slug);
    if (!override) return school;
    return {
      ...school,
      minGrade: override.minGrade ?? school.minGrade,
      annualCostMAD: [
        override.annualCostMin ?? school.annualCostMAD[0],
        override.annualCostMax ?? school.annualCostMAD[1],
      ] as [number, number],
    };
  });
}

export function useMergedSchools(): School[] {
  const { data } = useSchoolOverrides();
  return applyOverrides(SCHOOLS, data?.updates ?? []);
}
