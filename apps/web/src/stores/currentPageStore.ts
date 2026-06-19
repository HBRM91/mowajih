import { create } from "zustand";

interface CurrentPageState {
  schoolSlug: string | null;
  schoolName: string | null;
  setSchool: (slug: string, name: string) => void;
  clearSchool: () => void;
}

export const useCurrentPageStore = create<CurrentPageState>((set) => ({
  schoolSlug: null,
  schoolName: null,
  setSchool: (slug, name) => set({ schoolSlug: slug, schoolName: name }),
  clearSchool: () => set({ schoolSlug: null, schoolName: null }),
}));
