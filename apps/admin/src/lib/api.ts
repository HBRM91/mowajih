import { useAuthStore } from "../stores/authStore";

export const API_URL = import.meta.env.VITE_API_URL || "https://tawjih-api.hamzaelbouhali.workers.dev";

/** Build fetch options with Bearer auth header */
function withAuth(token: string | null, init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  };
}

/** Call this inside queryFn — reads token from store at call time */
export async function apiGet<T = unknown>(path: string): Promise<T> {
  const token = useAuthStore.getState().token;
  const res = await fetch(`${API_URL}${path}`, withAuth(token));
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const token = useAuthStore.getState().token;
  const res = await fetch(`${API_URL}${path}`, withAuth(token, {
    method: "POST",
    body: JSON.stringify(body),
  }));
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}
