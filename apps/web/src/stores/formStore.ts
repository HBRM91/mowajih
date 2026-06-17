import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FormState {
  step: number;
  bacTrack: string;
  // Core grades (used by the matching algorithm)
  generalGrade: string;
  mathGrade: string;
  physicsGrade: string;
  // Track-specific contextual grades (shown in form for relevant tracks)
  biologyGrade: string;
  economicsGrade: string;
  historyGrade: string;
  techGrade: string;
  // Profile
  city: string;
  region: string;
  financialBracket: string;
  // Optional contact info for dossier generation
  firstName: string;
  lastName: string;
  emailContact: string;
  phoneContact: string;
  consentPrivateSchools: boolean;
  consent: boolean;
  slimaneMode: boolean;
  setField: (field: keyof Omit<FormState, "setField" | "nextStep" | "prevStep" | "reset" | "setSlimaneMode">, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setSlimaneMode: (active: boolean) => void;
}

const initialState = {
  step: 1,
  bacTrack: "",
  generalGrade: "",
  mathGrade: "",
  physicsGrade: "",
  biologyGrade: "",
  economicsGrade: "",
  historyGrade: "",
  techGrade: "",
  city: "",
  region: "",
  financialBracket: "",
  firstName: "",
  lastName: "",
  emailContact: "",
  phoneContact: "",
  consentPrivateSchools: false,
  consent: false,
  slimaneMode: false,
};

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      ...initialState,
      setField: (field, value) => set((state) => ({ ...state, [field]: value })),
      nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
      prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
      reset: () => set(initialState),
      setSlimaneMode: (active) => set({ slimaneMode: active }),
    }),
    { name: "jad2-form" }
  )
);
