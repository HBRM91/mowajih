import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "../lib/api";

const STATUS_COLS = [
  { id: "new", label: "Nouveau", color: "bg-blue-500", border: "border-blue-200", bg: "bg-blue-50" },
  { id: "contacted", label: "Contacté", color: "bg-amber-500", border: "border-amber-200", bg: "bg-amber-50" },
  { id: "converted", label: "Converti", color: "bg-emerald-500", border: "border-emerald-200", bg: "bg-emerald-50" },
  { id: "dormant", label: "Inactif", color: "bg-slate-400", border: "border-slate-200", bg: "bg-slate-50" },
];

const TRACK_COLORS: Record<string, string> = {
  SM: "bg-blue-100 text-blue-700", PC: "bg-indigo-100 text-indigo-700",
  SVT: "bg-emerald-100 text-emerald-700", SE: "bg-amber-100 text-amber-700",
  SH: "bg-rose-100 text-rose-700", STI: "bg-slate-100 text-slate-700", L: "bg-purple-100 text-purple-700",
};

interface LeadRow {
  id: number;
  studentUuid: string;
  matchProbability: number;
  matchType: string;
  aiRationale: string;
  hasOptedIn: boolean;
  optInAt: string | null;
  status: string;
  assignedTo: string | null;
  notes: string | null;
  createdAt: string;
  universityId: number;
  universitySlug: string;
  universityName: string;
  studentBacTrack: string;
  studentMention: string;
  studentCity: string | null;
  studentRegion: string | null;
  studentGeneralGrade: number | null;
  studentFinancialBracket: string | null;
}

function LeadCard({ lead, onStatusChange }: { lead: LeadRow; onStatusChange: (uuid: string, status: string, universityId: number) => void }) {
  const prob = Math.round(lead.matchProbability * 100);
  const probColor = prob >= 70 ? "text-emerald-600" : prob >= 50 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow cursor-default group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TRACK_COLORS[lead.studentBacTrack] ?? "bg-slate-100 text-slate-600"}`}>
            {lead.studentBacTrack}
          </span>
          <span className="text-xs text-slate-500">{lead.studentMention}</span>
        </div>
        {lead.hasOptedIn && (
          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded flex-shrink-0">DÉBLOQUÉ</span>
        )}
      </div>

      <div className="text-xs font-semibold text-navy-700 mb-0.5 truncate">{lead.universityName}</div>
      <div className="text-[11px] text-slate-400 mb-3">
        {lead.studentCity || lead.studentRegion ? `${lead.studentCity ?? ""}${lead.studentCity && lead.studentRegion ? ", " : ""}${lead.studentRegion ?? ""}` : "Ville inconnue"}
        {lead.studentGeneralGrade ? ` · ${lead.studentGeneralGrade}/20` : ""}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 mr-3">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400">Match IA</span>
            <span className={`font-bold ${probColor}`}>{prob}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${prob >= 70 ? "bg-emerald-500" : prob >= 50 ? "bg-amber-400" : "bg-rose-400"}`}
              style={{ width: `${prob}%` }}
            />
          </div>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded capitalize">
          {lead.matchType.replace("_", "-")}
        </span>
      </div>

      <div className="flex gap-1 flex-wrap">
        {STATUS_COLS.filter((s) => s.id !== lead.status).map((s) => (
          <button
            key={s.id}
            onClick={() => onStatusChange(lead.studentUuid, s.id, lead.universityId)}
            className="text-[10px] px-2 py-1 rounded-lg border border-slate-200 text-slate-500 hover:border-navy-300 hover:text-navy-600 transition"
          >
            → {s.label}
          </button>
        ))}
      </div>

      <div className="text-[10px] text-slate-300 mt-2">
        {new Date(lead.createdAt).toLocaleDateString("fr-FR")}
        {lead.assignedTo ? ` · ${lead.assignedTo.split("@")[0]}` : ""}
      </div>
    </div>
  );
}

function TableView({ leads, onStatusChange }: { leads: LeadRow[]; onStatusChange: (uuid: string, status: string, universityId: number) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 border-b border-slate-100">
            <tr>
              {["Étudiant", "École", "Bac", "Mention", "Ville", "Prob.", "Statut", "Opt-In", "Date", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-navy-600 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => {
              const prob = Math.round(lead.matchProbability * 100);
              const col = STATUS_COLS.find((s) => s.id === lead.status);
              return (
                <tr key={`${lead.id}-${lead.universityId}`} className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-400">{lead.studentUuid.slice(0, 8)}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-navy-700 max-w-[140px] truncate">{lead.universityName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TRACK_COLORS[lead.studentBacTrack] ?? "bg-slate-100"}`}>
                      {lead.studentBacTrack}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{lead.studentMention}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    <span className={lead.hasOptedIn ? "" : "blur-sm select-none"}>{lead.studentCity ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${prob >= 70 ? "bg-emerald-500" : prob >= 50 ? "bg-amber-400" : "bg-rose-400"}`}
                          style={{ width: `${prob}%` }} />
                      </div>
                      <span className="text-xs font-bold text-navy-700">{prob}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${col?.color ?? "bg-slate-400"}`}>
                      {col?.label ?? lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {lead.hasOptedIn
                      ? <span className="text-emerald-600 text-xs font-semibold">✓ Débloqué</span>
                      : <span className="text-slate-300 text-xs">Anonyme</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => onStatusChange(lead.studentUuid, e.target.value, lead.universityId)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-gold-400"
                    >
                      {STATUS_COLS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {leads.length === 0 && (
        <div className="p-12 text-center text-slate-400 text-sm">Aucun lead dans ce filtre.</div>
      )}
    </div>
  );
}

export default function Pipeline() {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<{ leads: LeadRow[]; total: number }>({
    queryKey: ["admin-leads"],
    queryFn: () => apiGet("/api/admin/leads"),
    staleTime: 30_000,
  });

  const updateStatus = useMutation({
    mutationFn: ({ uuid, status, universityId }: { uuid: string; status: string; universityId: number }) =>
      apiPost(`/api/admin/leads/${uuid}/status`, { status, universityId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-leads"] }),
  });

  const handleStatusChange = (uuid: string, status: string, universityId: number) => {
    updateStatus.mutate({ uuid, status, universityId });
  };

  const allLeads = data?.leads ?? [];

  const filtered = allLeads.filter((l) => {
    const matchText = !filter ||
      l.universityName.toLowerCase().includes(filter.toLowerCase()) ||
      l.studentBacTrack?.toLowerCase().includes(filter.toLowerCase()) ||
      l.studentCity?.toLowerCase().includes(filter.toLowerCase()) ||
      l.studentMention?.toLowerCase().includes(filter.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchText && matchStatus;
  });

  const byStatus = Object.fromEntries(
    STATUS_COLS.map((col) => [col.id, filtered.filter((l) => l.status === col.id)])
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy-800">Pipeline Commercial</h1>
          <p className="text-navy-400 text-sm mt-1">
            {(data?.total ?? 0).toLocaleString()} leads · {allLeads.filter((l) => l.hasOptedIn).length} opt-ins débloqués
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-navy-50 p-1 rounded-xl gap-1">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "kanban" ? "bg-white text-navy-800 shadow-sm" : "text-navy-400 hover:text-navy-600"}`}
            >⠿ Kanban</button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === "table" ? "bg-white text-navy-800 shadow-sm" : "text-navy-400 hover:text-navy-600"}`}
            >☰ Table</button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATUS_COLS.map((col) => {
          const count = byStatus[col.id]?.length ?? allLeads.filter((l) => l.status === col.id).length;
          return (
            <button
              key={col.id}
              onClick={() => setStatusFilter(statusFilter === col.id ? "all" : col.id)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${statusFilter === col.id ? `${col.border} ${col.bg}` : "border-transparent bg-white hover:border-slate-200"} shadow-sm`}
            >
              <div className="font-heading text-2xl font-bold text-navy-800">{count}</div>
              <div className="text-xs text-navy-500 mt-0.5 flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${col.color}`} />
                {col.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Rechercher école, filière, ville..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 max-w-xs px-4 py-2.5 rounded-xl border border-gold-200 text-sm focus:border-gold-400 focus:ring-2 focus:ring-gold-100 outline-none bg-white"
        />
        {statusFilter !== "all" && (
          <button onClick={() => setStatusFilter("all")} className="text-xs text-slate-400 hover:text-slate-600 transition">
            ✕ Effacer filtre
          </button>
        )}
        <span className="text-xs text-slate-400">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Kanban view */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATUS_COLS.map((col) => {
            const colLeads = byStatus[col.id] ?? [];
            return (
              <div key={col.id} className={`rounded-2xl border ${col.border} ${col.bg} p-4 min-h-[200px]`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h3 className="font-bold text-navy-700 text-sm">{col.label}</h3>
                  <span className="ml-auto text-xs font-semibold bg-white rounded-full px-2 py-0.5 text-navy-600 shadow-sm">
                    {colLeads.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colLeads.map((lead) => (
                    <LeadCard key={`${lead.id}-${lead.universityId}`} lead={lead} onStatusChange={handleStatusChange} />
                  ))}
                  {colLeads.length === 0 && (
                    <div className="text-center text-xs text-slate-300 py-8">Aucun lead</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table view */}
      {view === "table" && (
        <TableView leads={filtered} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
