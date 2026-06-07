import { create } from "zustand";

// Token stored in memory only — not localStorage/sessionStorage (XSS protection).
// This means re-login is required on page refresh, which is appropriate for admin.

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  isAuthenticated: false,
  setToken: (token: string) => set({ token, isAuthenticated: true }),
  clearAuth: () => set({ token: null, isAuthenticated: false }),
}));
