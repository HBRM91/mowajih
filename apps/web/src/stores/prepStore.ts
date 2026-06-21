import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Exam } from "../data/prepQuestions";

export interface SubjectProgress {
  correct: number;
  total: number;
  lastAnswered: string; // ISO date
}

export interface ExamProgress {
  xp: number;
  totalCorrect: number;
  totalAnswered: number;
  sessions: number;
  subjectProgress: Record<string, SubjectProgress>;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  diagnosticDone: boolean;
}

interface PrepState {
  progress: Record<Exam, ExamProgress>;
  addResult: (exam: Exam, subject: string, correct: boolean, xpEarned: number) => void;
  markDiagnosticDone: (exam: Exam) => void;
  incrementSession: (exam: Exam) => void;
  updateStreak: (exam: Exam) => void;
  resetExam: (exam: Exam) => void;
  getTotalXP: (exam: Exam) => number;
  getLevel: (exam: Exam) => number; // 0-3
  getSubjectMastery: (exam: Exam, subject: string) => number; // 0-100%
  getOverallAccuracy: (exam: Exam) => number; // 0-100%
}

const DEFAULT_EXAM_PROGRESS: ExamProgress = {
  xp: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  sessions: 0,
  subjectProgress: {},
  streak: 0,
  lastActiveDate: "",
  diagnosticDone: false,
};

// XP thresholds for each level (0=débutant, 1, 2, 3=reçu)
const XP_THRESHOLDS = [0, 100, 300, 600];

export const usePrepStore = create<PrepState>()(
  persist(
    (set, get) => ({
      progress: {
        ensa: { ...DEFAULT_EXAM_PROGRESS },
        ena: { ...DEFAULT_EXAM_PROGRESS },
        encg: { ...DEFAULT_EXAM_PROGRESS },
      },

      addResult: (exam, subject, correct, xpEarned) => {
        set((state) => {
          const prev = state.progress[exam];
          const prevSubject = prev.subjectProgress[subject] ?? { correct: 0, total: 0, lastAnswered: "" };
          return {
            progress: {
              ...state.progress,
              [exam]: {
                ...prev,
                xp: prev.xp + (correct ? xpEarned : 0),
                totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
                totalAnswered: prev.totalAnswered + 1,
                subjectProgress: {
                  ...prev.subjectProgress,
                  [subject]: {
                    correct: prevSubject.correct + (correct ? 1 : 0),
                    total: prevSubject.total + 1,
                    lastAnswered: new Date().toISOString(),
                  },
                },
              },
            },
          };
        });
      },

      markDiagnosticDone: (exam) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [exam]: { ...state.progress[exam], diagnosticDone: true },
          },
        }));
      },

      incrementSession: (exam) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [exam]: { ...state.progress[exam], sessions: state.progress[exam].sessions + 1 },
          },
        }));
      },

      updateStreak: (exam) => {
        const today = new Date().toISOString().slice(0, 10);
        set((state) => {
          const prev = state.progress[exam];
          const lastDate = prev.lastActiveDate;
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const newStreak = lastDate === today ? prev.streak
            : lastDate === yesterday ? prev.streak + 1
            : 1;
          return {
            progress: {
              ...state.progress,
              [exam]: { ...prev, streak: newStreak, lastActiveDate: today },
            },
          };
        });
      },

      resetExam: (exam) => {
        set((state) => ({
          progress: { ...state.progress, [exam]: { ...DEFAULT_EXAM_PROGRESS } },
        }));
      },

      getTotalXP: (exam) => get().progress[exam].xp,

      getLevel: (exam) => {
        const xp = get().progress[exam].xp;
        let level = 0;
        for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
          if (xp >= XP_THRESHOLDS[i]) { level = i; break; }
        }
        return level;
      },

      getSubjectMastery: (exam, subject) => {
        const sp = get().progress[exam].subjectProgress[subject];
        if (!sp || sp.total === 0) return 0;
        return Math.round((sp.correct / sp.total) * 100);
      },

      getOverallAccuracy: (exam) => {
        const p = get().progress[exam];
        if (p.totalAnswered === 0) return 0;
        return Math.round((p.totalCorrect / p.totalAnswered) * 100);
      },
    }),
    { name: "jad2-prep-progress" }
  )
);

export const XP_THRESHOLDS_EXPORT = XP_THRESHOLDS;
