const colors: Record<string, string> = {
  Passable: "bg-slate-100 text-slate-700",
  "Assez Bien": "bg-blue-50 text-blue-700",
  Bien: "bg-emerald-50 text-emerald-700",
  "Très Bien": "bg-amber-50 text-amber-700",
};

export default function MentionBadge({ mention }: { mention: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[mention] || "bg-slate-100"}`}>
      {mention}
    </span>
  );
}
