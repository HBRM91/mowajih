import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet, API_URL } from "../lib/api";
import { useAuthStore } from "../stores/authStore";

const BAC_TRACKS = ["SM", "PC", "SVT", "SE", "SH", "STI", "L"];
const MENTIONS = ["Passable", "Assez Bien", "Bien", "Très Bien"];
const CITIES = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Oujda", "Tétouan", "Salé", "Meknès"];
const BUDGETS = [
  { value: "<<3000", label: "< 3 000 MAD/mois" },
  { value: "3000-8000", label: "3 000 – 8 000 MAD/mois" },
  { value: "8000-15000", label: "8 000 – 15 000 MAD/mois" },
  { value: ">15000", label: "> 15 000 MAD/mois" },
];

interface PrivateLead {
  uuid: string;
  firstName: string | null;
  lastName: string | null;
  emailContact: string | null;
  phoneContact: string | null;
  bacTrack: string;
  generalGrade: number;
  mention: string;
  city: string;
  region: string;
  financialBracket: string;
  consentPrivateAt: string | null;
  topSchools: string[];
  createdAt: string | null;
}

interface PrivateLeadsResp {
  leads: PrivateLead[];
  total: number;
}

function buildQS(filters: Record<string, string>) {
  const p = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) p.set(k, v); });
  return p.toString() ? `?${p.toString()}` : "";
}

export default function LeadsExport() {
  const token = useAuthStore((s) => s.token);
  const [filters, setFilters] = useState<Record<string, string>>({
    bacTrack: "", mention: "", city: "", financialBracket: "",
    minGrade: "", maxGrade: "",
  });
  const [downloading, setDownloading] = useState(false);
  const [applied, setApplied] = useState<Record<string, string>>(filters);

  const { data, isLoading, isFetching } = useQuery<PrivateLeadsResp>({
    queryKey: ["private-leads", applied],
    queryFn: () => apiGet<PrivateLeadsResp>(`/api/admin/leads/private-school${buildQS(applied)}`),
    staleTime: 60_000,
  });

  const leads = data?.leads ?? [];

  async function handleDownload() {
    setDownloading(true);
    try {
      const qs = buildQS(applied);
      const res = await fetch(`${API_URL}/api/admin/leads/private-school/export${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
      a.download = `jad2-leads-ecoles-privees-${date}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  const bacStats = BAC_TRACKS.map((t) => ({
    track: t,
    count: leads.filter((l) => l.bacTrack === t).length,
  })).filter((s) => s.count > 0);

  const mentionStats = MENTIONS.map((m) => ({
    mention: m,
    count: leads.filter((l) => l.mention === m).length,
  })).filter((s) => s.count > 0);

  const TRACK_COLORS: Record<string, string> = {
    SM: "bg-blue-100 text-blue-700", PC: "bg-indigo-100 text-indigo-700",
    SVT: "bg-emerald-100 text-emerald-700", SE: "bg-amber-100 text-amber-700",
    SH: "bg-rose-100 text-rose-700", STI: "bg-slate-100 text-slate-700", L: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-navy-800">Export Leads — Écoles Privées</h1>
          <p className="text-sm text-navy-400 mt-1">
            Étudiants ayant explicitement consenti au partage de leurs coordonnées avec vos écoles partenaires.
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={leads.length === 0 || downloading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold text-sm hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
        >
          {downloading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Génération...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger CSV ({leads.length})
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gold-100 p-5">
          <div className="text-3xl font-heading font-bold text-navy-800">{isLoading ? "—" : leads.length}</div>
          <div className="text-sm text-navy-400 mt-1">Leads consents</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Avec coordonnées</div>
        </div>
        <div className="bg-white rounded-2xl border border-gold-100 p-5">
          <div className="text-3xl font-heading font-bold text-navy-800">
            {isLoading ? "—" : leads.filter((l) => l.emailContact).length}
          </div>
          <div className="text-sm text-navy-400 mt-1">Avec email</div>
        </div>
        <div className="bg-white rounded-2xl border border-gold-100 p-5">
          <div className="text-3xl font-heading font-bold text-navy-800">
            {isLoading ? "—" : leads.filter((l) => l.phoneContact).length}
          </div>
          <div className="text-sm text-navy-400 mt-1">Avec téléphone</div>
        </div>
        <div className="bg-white rounded-2xl border border-gold-100 p-5">
          <div className="text-3xl font-heading font-bold text-navy-800">
            {isLoading ? "—" : leads.length > 0 ? (leads.reduce((s, l) => s + l.generalGrade, 0) / leads.length).toFixed(1) : "—"}
          </div>
          <div className="text-sm text-navy-400 mt-1">Note moyenne</div>
          <div className="text-[11px] text-navy-300 mt-0.5">/20</div>
        </div>
      </div>

      {/* Distribution pills */}
      {leads.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-navy-400 font-semibold uppercase tracking-wider">Filières:</span>
            {bacStats.map(({ track, count }) => (
              <span key={track} className={`text-xs font-bold px-2.5 py-1 rounded-full ${TRACK_COLORS[track] ?? "bg-gray-100 text-gray-700"}`}>
                {track} ({count})
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-navy-400 font-semibold uppercase tracking-wider">Mentions:</span>
            {mentionStats.map(({ mention, count }) => (
              <span key={mention} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-100 text-gold-800">
                {mention} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gold-100 p-5">
        <h2 className="text-sm font-bold text-navy-700 mb-4 uppercase tracking-wide">Filtres</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[10px] text-navy-400 font-semibold uppercase mb-1">Filière Bac</label>
            <select
              value={filters.bacTrack}
              onChange={(e) => setFilters((f) => ({ ...f, bacTrack: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-navy-200 rounded-xl text-navy-700 focus:border-gold-400 outline-none bg-white"
            >
              <option value="">Toutes</option>
              {BAC_TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-navy-400 font-semibold uppercase mb-1">Mention</label>
            <select
              value={filters.mention}
              onChange={(e) => setFilters((f) => ({ ...f, mention: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-navy-200 rounded-xl text-navy-700 focus:border-gold-400 outline-none bg-white"
            >
              <option value="">Toutes</option>
              {MENTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-navy-400 font-semibold uppercase mb-1">Ville</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-navy-200 rounded-xl text-navy-700 focus:border-gold-400 outline-none bg-white"
            >
              <option value="">Toutes</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-navy-400 font-semibold uppercase mb-1">Budget</label>
            <select
              value={filters.financialBracket}
              onChange={(e) => setFilters((f) => ({ ...f, financialBracket: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-navy-200 rounded-xl text-navy-700 focus:border-gold-400 outline-none bg-white"
            >
              <option value="">Tous</option>
              {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-navy-400 font-semibold uppercase mb-1">Note min</label>
            <input
              type="number" min="0" max="20" step="0.5"
              value={filters.minGrade}
              onChange={(e) => setFilters((f) => ({ ...f, minGrade: e.target.value }))}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-navy-200 rounded-xl text-navy-700 focus:border-gold-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] text-navy-400 font-semibold uppercase mb-1">Note max</label>
            <input
              type="number" min="0" max="20" step="0.5"
              value={filters.maxGrade}
              onChange={(e) => setFilters((f) => ({ ...f, maxGrade: e.target.value }))}
              placeholder="20"
              className="w-full px-3 py-2 text-sm border border-navy-200 rounded-xl text-navy-700 focus:border-gold-400 outline-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setApplied(filters)}
            className="px-5 py-2 bg-navy-800 text-gold-200 rounded-xl text-sm font-bold hover:bg-navy-900 transition"
          >
            Appliquer les filtres
          </button>
          <button
            onClick={() => {
              const reset = { bacTrack: "", mention: "", city: "", financialBracket: "", minGrade: "", maxGrade: "" };
              setFilters(reset);
              setApplied(reset);
            }}
            className="px-4 py-2 border border-navy-200 text-navy-500 rounded-xl text-sm hover:bg-navy-50 transition"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Preview table */}
      <div className="bg-white rounded-2xl border border-gold-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gold-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-navy-700">Aperçu — {leads.length} résultat{leads.length !== 1 ? "s" : ""}</h2>
          {isFetching && <div className="w-4 h-4 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50/50">
                {["Prénom / Nom", "Email", "Téléphone", "Bac", "Note", "Mention", "Ville", "Budget", "Écoles cibles"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-navy-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-navy-100 rounded animate-pulse w-16" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-navy-300 text-sm">
                    Aucun lead trouvé avec les filtres sélectionnés.
                  </td>
                </tr>
              ) : (
                leads.slice(0, 20).map((lead) => (
                  <tr key={lead.uuid} className="hover:bg-gold-50/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-navy-700 whitespace-nowrap">
                      {lead.firstName || lead.lastName
                        ? `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim()
                        : <span className="text-navy-300 italic">Anonyme</span>}
                    </td>
                    <td className="px-4 py-3 text-navy-500 text-xs">
                      {lead.emailContact
                        ? <a href={`mailto:${lead.emailContact}`} className="text-blue-600 hover:underline">{lead.emailContact}</a>
                        : <span className="text-navy-200">—</span>}
                    </td>
                    <td className="px-4 py-3 text-navy-600 text-xs whitespace-nowrap">
                      {lead.phoneContact || <span className="text-navy-200">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TRACK_COLORS[lead.bacTrack] ?? "bg-gray-100 text-gray-700"}`}>
                        {lead.bacTrack}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-navy-700 whitespace-nowrap">
                      {lead.generalGrade.toFixed(2)}/20
                    </td>
                    <td className="px-4 py-3 text-xs text-navy-500 whitespace-nowrap">{lead.mention}</td>
                    <td className="px-4 py-3 text-xs text-navy-500 whitespace-nowrap">{lead.city}</td>
                    <td className="px-4 py-3 text-[11px] text-navy-400 whitespace-nowrap">
                      {lead.financialBracket}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {lead.topSchools.slice(0, 2).map((s) => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 bg-navy-100 text-navy-600 rounded font-medium">
                            {s.toUpperCase().split("-")[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {leads.length > 20 && (
          <div className="px-5 py-3 border-t border-gold-50 text-[11px] text-navy-400 text-center">
            Aperçu limité à 20 lignes. Le CSV complet contient {leads.length} entrées.
          </div>
        )}
      </div>

      {/* CNDP disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div>
          <strong>Conformité CNDP :</strong> Ces données ne peuvent être utilisées qu'aux fins de recrutement académique par les établissements partenaires JAD2. Redistribution, revente ou tout usage commercial non déclaré est interdit. Chaque étudiant a explicitement consenti à ce partage et peut le retirer à tout moment.
        </div>
      </div>
    </div>
  );
}
