import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FormState {
  step: number;
  bacTrack: string;
  mathGrade: string;
  physicsGrade: string;
  generalGrade: string;
  city: string;
  region: string;
  financialBracket: string;
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
  mathGrade: "",
  physicsGrade: "",
  generalGrade: "",
  city: "",
  region: "",
  financialBracket: "",
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
