const colors: Record<string, string> = {
  SM: "bg-blue-50 text-blue-700",
  PC: "bg-indigo-50 text-indigo-700",
  SVT: "bg-emerald-50 text-emerald-700",
  SE: "bg-amber-50 text-amber-700",
  SH: "bg-rose-50 text-rose-700",
  STI: "bg-slate-50 text-slate-700",
  L: "bg-purple-50 text-purple-700",
};

export default function BacTrackBadge({ track }: { track: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[track] || "bg-slate-100 text-slate-700"}`}>
      {track}
    </span>
  );
}
