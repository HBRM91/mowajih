import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tasteful, non-juvenile engagement tracking: no XP, no levels, no popups.
// Tracks genuine exploration depth across the platform's tools (comparator,
// career families, Slimane AI) to power the Orientation Readiness indicator
// and the 3 milestone quests on the Results page.

export const QUEST_TARGETS = { compare: 3, jobFamilies: 3 };

interface ProgressState {
  comparedSlugs: string[];
  viewedJobFamilies: string[];
  slimaneQueried: boolean;
  markCompared: (slug: string) => void;
  markJobFamilyViewed: (jobFamily: string) => void;
  markSlimaneQueried: () => void;
  reset: () => void;
}

const initialState = {
  comparedSlugs: [] as string[],
  viewedJobFamilies: [] as string[],
  slimaneQueried: false,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,
      markCompared: (slug) => {
        const cur = get().comparedSlugs;
        if (!cur.includes(slug)) set({ comparedSlugs: [...cur, slug] });
      },
      markJobFamilyViewed: (jobFamily) => {
        const cur = get().viewedJobFamilies;
        if (!cur.includes(jobFamily)) set({ viewedJobFamilies: [...cur, jobFamily] });
      },
      markSlimaneQueried: () => {
        if (!get().slimaneQueried) set({ slimaneQueried: true });
      },
      reset: () => set(initialState),
    }),
    { name: "jad2-progress" }
  )
);

export interface QuestStatus {
  analyst: boolean;
  explorer: boolean;
  strategist: boolean;
}

export function getQuestStatus(state: Pick<ProgressState, "comparedSlugs" | "viewedJobFamilies" | "slimaneQueried">): QuestStatus {
  return {
    analyst: state.comparedSlugs.length >= QUEST_TARGETS.compare,
    explorer: state.viewedJobFamilies.length >= QUEST_TARGETS.jobFamilies,
    strategist: state.slimaneQueried,
  };
}

/** Readiness is the average of 4 equally-weighted exploration signals: form
 * completion, comparator usage, career-family exploration, and Slimane usage. */
export function getReadinessPercent(
  formStep: number,
  state: Pick<ProgressState, "comparedSlugs" | "viewedJobFamilies" | "slimaneQueried">
): number {
  const formScore = Math.min(formStep, 4) / 4;
  const compareScore = Math.min(state.comparedSlugs.length, QUEST_TARGETS.compare) / QUEST_TARGETS.compare;
  const jobScore = Math.min(state.viewedJobFamilies.length, QUEST_TARGETS.jobFamilies) / QUEST_TARGETS.jobFamilies;
  const slimaneScore = state.slimaneQueried ? 1 : 0;
  return Math.round(((formScore + compareScore + jobScore + slimaneScore) / 4) * 100);
}
