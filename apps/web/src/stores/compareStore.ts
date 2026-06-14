import { create } from "zustand";
import type { School } from "../data/schools";

interface CompareStore {
  schools: School[];
  add: (school: School) => void;
  remove: (slug: string) => void;
  toggle: (school: School) => void;
  clear: () => void;
  has: (slug: string) => boolean;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  schools: [],
  add: (school) => {
    const current = get().schools;
    if (current.length >= 3 || current.some((s) => s.slug === school.slug)) return;
    set({ schools: [...current, school] });
  },
  remove: (slug) => set({ schools: get().schools.filter((s) => s.slug !== slug) }),
  toggle: (school) => {
    get().has(school.slug) ? get().remove(school.slug) : get().add(school);
  },
  clear: () => set({ schools: [] }),
  has: (slug) => get().schools.some((s) => s.slug === slug),
}));
