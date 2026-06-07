import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Badge = "new" | "first_match" | "explorer" | "optin_hero" | "strategist";

interface GameState {
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  badges: Badge[];
  achievements: string[];
  showLevelUp: boolean;
  lastBadgeEarned: Badge | null;
  addXp: (amount: number, reason?: string) => void;
  awardBadge: (badge: Badge) => void;
  dismissLevelUp: () => void;
  dismissBadge: () => void;
  checkStreak: () => void;
}

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000];

const LEVEL_NAMES = [
  "gamification.level_bachelier",
  "gamification.level_confirme",
  "gamification.level_expert",
  "gamification.level_stratege",
  "gamification.level_stratege",
  "gamification.level_stratege",
  "gamification.level_stratege",
  "gamification.level_stratege",
];

export function getLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i;
  }
  return 0;
}

export function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level, LEVEL_NAMES.length - 1)];
}

export function getXpForNextLevel(xp: number): number {
  const currentLevel = getLevel(xp);
  return LEVEL_THRESHOLDS[currentLevel + 1] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function getLevelProgress(xp: number): number {
  const currentLevel = getLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel + 1];
  if (!nextThreshold) return 100;
  return ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 0,
      streak: 0,
      lastActive: new Date().toISOString().split("T")[0],
      badges: [],
      achievements: [],
      showLevelUp: false,
      lastBadgeEarned: null,

      addXp: (amount, reason) => {
        const state = get();
        const oldLevel = state.level;
        const newXp = state.xp + amount;
        const newLevel = getLevel(newXp);
        const newAchievements = reason ? [...state.achievements, reason] : state.achievements;
        set({ xp: newXp, level: newLevel, achievements: newAchievements });
        if (newLevel > oldLevel) {
          set({ showLevelUp: true });
        }
      },

      awardBadge: (badge) => {
        const state = get();
        if (!state.badges.includes(badge)) {
          set({ badges: [...state.badges, badge], lastBadgeEarned: badge });
          get().addXp(50, `Badge earned: ${badge}`);
        }
      },

      dismissLevelUp: () => set({ showLevelUp: false }),
      dismissBadge: () => set({ lastBadgeEarned: null }),

      checkStreak: () => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        if (state.lastActive === yesterday) {
          set({ streak: state.streak + 1, lastActive: today });
        } else if (state.lastActive !== today) {
          set({ streak: 1, lastActive: today });
        }
      },
    }),
    { name: "jad2-game" }
  )
);
