import { useQuery } from "@tanstack/react-query";

export type PlatformMode = "anonymous" | "full";

const API_BASE = import.meta.env.VITE_API_URL ?? "https://tawjih-api.hamzaelbouhali.workers.dev";

export function usePlatformMode(): PlatformMode {
  const { data } = useQuery<{ mode: PlatformMode }>({
    queryKey: ["platform-mode"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/public/platform-mode`);
      return res.json() as Promise<{ mode: PlatformMode }>;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
  return data?.mode ?? "anonymous";
}
