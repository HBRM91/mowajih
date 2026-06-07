import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  universityId: number | null;
  email: string | null;
  setAuth: (universityId: number, email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      universityId: null,
      email: null,
      setAuth: (universityId, email) => set({ universityId, email }),
      clearAuth: () => set({ universityId: null, email: null }),
    }),
    { name: "tawjih-admin-auth" }
  )
);
