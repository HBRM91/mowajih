import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";

const API_URL = import.meta.env.VITE_API_URL || "https://tawjih-api.hamzaelbouhali.workers.dev";

// Snapshot of schools.ts data — update this list when schools.ts changes
const SCHOOLS_SNAPSHOT = [
  { slug: "ensam-casablanca", shortName: "ENSAM Casablanca", name: "École Nationale Supérieure d'Arts et Métiers de Casablanca", type: "engineering", tracks: ["SM", "PC", "STI"], currentMinGrade: 12.25, currentCostMin: 48000, currentCostMax: 52000, admissionType: "concours" },
  { slug: "ensam-meknes", shortName: "ENSAM Meknès", name: "École Nationale Supérieure d'Arts et Métiers de Meknès", type: "engineering", tracks: ["SM", "PC", "STI"], currentMinGrade: 12.25, currentCostMin: 48000, currentCostMax: 52000, admissionType: "concours" },
  { slug: "ensa-agadir", shortName: "ENSA Agadir", name: "École Nationale des Sciences Appliquées d'Agadir", type: "engineering", tracks: ["SM", "PC", "SVT"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 3000, admissionType: "concours" },
  { slug: "ensa-casablanca", shortName: "ENSA Casablanca", name: "École Nationale des Sciences Appliquées de Casablanca", type: "engineering", tracks: ["SM", "PC"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 3000, admissionType: "concours" },
  { slug: "ensa-fes", shortName: "ENSA Fès", name: "École Nationale des Sciences Appliquées de Fès", type: "engineering", tracks: ["SM", "PC", "SVT"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 3000, admissionType: "concours" },
  { slug: "ensa-kenitra", shortName: "ENSA Kénitra", name: "École Nationale des Sciences Appliquées de Kénitra", type: "engineering", tracks: ["SM", "PC", "SVT"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 3000, admissionType: "concours" },
  { slug: "ensa-marrakech", shortName: "ENSA Marrakech", name: "École Nationale des Sciences Appliquées de Marrakech", type: "engineering", tracks: ["SM", "PC", "SVT"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 3000, admissionType: "concours" },
  { slug: "ensa-oujda", shortName: "ENSA Oujda", name: "École Nationale des Sciences Appliquées d'Oujda", type: "engineering", tracks: ["SM", "PC", "SVT"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 3000, admissionType: "concours" },
  { slug: "ensa-safi", shortName: "ENSA Safi", name: "École Nationale des Sciences Appliquées de Safi", type: "engineering", tracks: ["SM", "PC", "SVT"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 3000, admissionType: "concours" },
  { slug: "ensa-rabat", shortName: "ENSA Rabat", name: "École Nationale des Sciences Appliquées de Rabat", type: "engineering", tracks: ["SM", "PC"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 3000, admissionType: "concours" },
  { slug: "ensa-tetouan", shortName: "ENSA Tétouan", name: "École Nationale des Sciences Appliquées de Tétouan", type: "engineering", tracks: ["SM", "PC", "SVT"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 3000, admissionType: "concours" },
  { slug: "iscae", shortName: "ISCAE", name: "Institut Supérieur de Commerce et d'Administration des Entreprises", type: "business", tracks: ["SE", "SM", "PC", "SVT"], currentMinGrade: 17.24, currentCostMin: 30000, currentCostMax: 45000, admissionType: "concours" },
  { slug: "encg-casablanca", shortName: "ENCG Casablanca", name: "École Nationale de Commerce et de Gestion de Casablanca", type: "business", tracks: ["SE", "SM", "PC"], currentMinGrade: 12, currentCostMin: 5000, currentCostMax: 12000, admissionType: "tafem" },
  { slug: "encg-rabat", shortName: "ENCG Rabat", name: "École Nationale de Commerce et de Gestion de Rabat", type: "business", tracks: ["SE", "SM", "PC"], currentMinGrade: 12, currentCostMin: 5000, currentCostMax: 12000, admissionType: "tafem" },
  { slug: "encg-agadir", shortName: "ENCG Agadir", name: "École Nationale de Commerce et de Gestion d'Agadir", type: "business", tracks: ["SE", "SM", "PC"], currentMinGrade: 12, currentCostMin: 5000, currentCostMax: 12000, admissionType: "tafem" },
  { slug: "encg-fes", shortName: "ENCG Fès", name: "École Nationale de Commerce et de Gestion de Fès", type: "business", tracks: ["SE", "SM", "PC"], currentMinGrade: 12, currentCostMin: 5000, currentCostMax: 12000, admissionType: "tafem" },
  { slug: "encg-tangier", shortName: "ENCG Tanger", name: "École Nationale de Commerce et de Gestion de Tanger", type: "business", tracks: ["SE", "SM", "PC"], currentMinGrade: 12, currentCostMin: 5000, currentCostMax: 12000, admissionType: "tafem" },
  { slug: "iav-hassan-ii", shortName: "IAV Hassan II", name: "Institut Agronomique et Vétérinaire Hassan II", type: "agriculture", tracks: ["SVT", "PC", "SM"], currentMinGrade: 14, currentCostMin: 0, currentCostMax: 5000, admissionType: "concours" },
  { slug: "ena-rabat", shortName: "ENA", name: "École Nationale d'Architecture", type: "architecture", tracks: ["SM", "PC", "SH"], currentMinGrade: 15, currentCostMin: 0, currentCostMax: 5000, admissionType: "concours" },
  { slug: "fm-rabat", shortName: "FMPR", name: "Faculté de Médecine et de Pharmacie de Rabat", type: "medicine", tracks: ["SVT", "PC"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 5000, admissionType: "concours" },
  { slug: "fm-casablanca", shortName: "FMPC", name: "Faculté de Médecine et de Pharmacie de Casablanca", type: "medicine", tracks: ["SVT", "PC"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 5000, admissionType: "concours" },
  { slug: "fm-fes", shortName: "FMPF", name: "Faculté de Médecine et de Pharmacie de Fès", type: "medicine", tracks: ["SVT", "PC"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 5000, admissionType: "concours" },
  { slug: "fm-marrakech", shortName: "FMPM", name: "Faculté de Médecine et de Pharmacie de Marrakech", type: "medicine", tracks: ["SVT", "PC"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 5000, admissionType: "concours" },
  { slug: "uir", shortName: "UIR", name: "Université Internationale de Rabat", type: "engineering", tracks: ["SM", "PC", "STI", "SE"], currentMinGrade: 12, currentCostMin: 67000, currentCostMax: 125000, admissionType: "dossier" },
  { slug: "al-akhawayn", shortName: "AUI", name: "Université Al Akhawayn", type: "university", tracks: ["SM", "PC", "SE", "SH"], currentMinGrade: 14, currentCostMin: 75000, currentCostMax: 90000, admissionType: "dossier" },
  { slug: "hem", shortName: "HEM", name: "HEM Business School", type: "business", tracks: ["SE", "SH", "SM", "L"], currentMinGrade: 12, currentCostMin: 70000, currentCostMax: 79000, admissionType: "dossier" },
  { slug: "mundiapolis", shortName: "Mundiapolis", name: "Université Mundiapolis", type: "university", tracks: ["SM", "PC", "SE", "SH"], currentMinGrade: 12, currentCostMin: 30000, currentCostMax: 35000, admissionType: "dossier" },
  { slug: "emsi", shortName: "EMSI", name: "École Marocaine des Sciences de l'Ingénieur", type: "engineering", tracks: ["SM", "PC", "STI", "SE"], currentMinGrade: 11, currentCostMin: 20000, currentCostMax: 40000, admissionType: "dossier" },
  { slug: "esith", shortName: "ESITH", name: "École Supérieure des Industries du Textile", type: "engineering", tracks: ["SM", "STI", "SE"], currentMinGrade: 12, currentCostMin: 10000, currentCostMax: 25000, admissionType: "dossier" },
];

type SchoolSnapshot = typeof SCHOOLS_SNAPSHOT[0];

interface Suggestion {
  slug: string;
  currentMinGrade: number;
  suggestedMinGrade: number;
  currentCostMin: number;
  currentCostMax: number;
  suggestedCostMin: number;
  suggestedCostMax: number;
  confidence: "high" | "medium" | "low";
  source: string;
  notes: string;
}

interface KVOverride {
  slug: string;
  minGrade?: number;
  annualCostMin?: number;
  annualCostMax?: number;
  notes?: string;
}

interface KVState {
  updates: KVOverride[];
  updatedAt: string | null;
  count?: number;
}

const CONFIDENCE_COLORS = {
  high: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-red-50 text-red-700 border-red-200",
};

const TYPE_ICONS: Record<string, string> = {
  engineering: "⚙️",
  business: "💼",
  medicine: "🏥",
  architecture: "🏛️",
  agriculture: "🌱",
  university: "🎓",
};

export default function Seuils() {
  const { token } = useAuthStore();
  const qc = useQueryClient();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set(SCHOOLS_SNAPSHOT.map((s) => s.slug)));
  const [suggestMode, setSuggestMode] = useState<"all" | "select">("all");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: kvState, isLoading: kvLoading } = useQuery<KVState>({
    queryKey: ["admin-seuils-kv"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/seuils`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  });

  const suggestMutation = useMutation({
    mutationFn: async (schools: SchoolSnapshot[]) => {
      const res = await fetch(`${API_URL}/api/admin/seuils/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ schools }),
      });
      if (!res.ok) throw new Error("Suggestion API error");
      return res.json() as Promise<{ suggestions: Suggestion[]; generatedAt: string }>;
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions ?? []);
      setApproved(new Set(data.suggestions.filter((s) => s.confidence === "high").map((s) => s.slug)));
      setShowSuggestions(true);
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (updates: KVOverride[]) => {
      const res = await fetch(`${API_URL}/api/admin/seuils/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) throw new Error("Apply API error");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-seuils-kv"] });
      setShowSuggestions(false);
      setSuggestions([]);
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      await fetch(`${API_URL}/api/admin/seuils/reset`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-seuils-kv"] }),
  });

  const handleGenerate = () => {
    const toSuggest = suggestMode === "all"
      ? SCHOOLS_SNAPSHOT
      : SCHOOLS_SNAPSHOT.filter((s) => selectedSlugs.has(s.slug));
    suggestMutation.mutate(toSuggest);
  };

  const handleApply = () => {
    const updates: KVOverride[] = suggestions
      .filter((s) => approved.has(s.slug))
      .map((s) => ({
        slug: s.slug,
        minGrade: s.suggestedMinGrade,
        annualCostMin: s.suggestedCostMin,
        annualCostMax: s.suggestedCostMax,
        notes: s.notes,
      }));
    applyMutation.mutate(updates);
  };

  const toggleApprove = (slug: string) => {
    setApproved((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const kvMap = new Map((kvState?.updates ?? []).map((u) => [u.slug, u]));
  const approvedCount = suggestions.filter((s) => approved.has(s.slug)).length;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-900">Gestion des Seuils</h1>
          <p className="text-navy-400 text-sm mt-1">
            Mettez à jour les seuils d'admission et frais de scolarité via suggestions IA.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {kvState?.updatedAt && (
            <span className="text-xs text-navy-400 bg-navy-50 border border-navy-100 px-3 py-1.5 rounded-full">
              {kvState.count ?? kvState.updates.length} override{(kvState.count ?? kvState.updates.length) !== 1 ? "s" : ""} actif
              {kvState.updatedAt && ` · ${new Date(kvState.updatedAt).toLocaleDateString("fr-MA")}`}
            </span>
          )}
          {kvState?.updates && kvState.updates.length > 0 && (
            <button
              onClick={() => { if (confirm("Réinitialiser tous les overrides KV ?")) resetMutation.mutate(); }}
              className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-full transition"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Mode selector + Generate button */}
      <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
        <div className="flex items-center gap-6 mb-4">
          <h2 className="font-semibold text-navy-800 text-sm">Générer des suggestions IA</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSuggestMode("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${suggestMode === "all" ? "bg-navy-800 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}
            >
              Tous les établissements ({SCHOOLS_SNAPSHOT.length})
            </button>
            <button
              onClick={() => setSuggestMode("select")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${suggestMode === "select" ? "bg-navy-800 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}
            >
              Sélection ({selectedSlugs.size})
            </button>
          </div>
        </div>

        {suggestMode === "select" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
            {SCHOOLS_SNAPSHOT.map((s) => (
              <label key={s.slug} className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-xs transition ${selectedSlugs.has(s.slug) ? "border-gold-400 bg-gold-50 text-navy-800" : "border-navy-100 bg-white text-navy-500 hover:border-navy-200"}`}>
                <input
                  type="checkbox"
                  checked={selectedSlugs.has(s.slug)}
                  onChange={() => {
                    setSelectedSlugs((prev) => {
                      const next = new Set(prev);
                      next.has(s.slug) ? next.delete(s.slug) : next.add(s.slug);
                      return next;
                    });
                  }}
                  className="w-3 h-3 accent-gold-500"
                />
                <span className="truncate">{s.shortName}</span>
              </label>
            ))}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={suggestMutation.isPending || (suggestMode === "select" && selectedSlugs.size === 0)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 rounded-full font-bold text-sm hover:from-navy-800 hover:to-navy-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {suggestMutation.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>✨ Générer suggestions IA</>
          )}
        </button>

        {suggestMutation.isError && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
            Erreur lors de la génération. Vérifiez la clé API et réessayez.
          </p>
        )}
      </div>

      {/* AI Suggestions review */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-gold-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gold-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-navy-800">Suggestions IA — À réviser</h2>
              <p className="text-xs text-navy-400 mt-0.5">{suggestions.length} suggestions · {approvedCount} approuvées</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setApproved(new Set(suggestions.map((s) => s.slug)))}
                className="text-xs text-emerald-600 border border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition"
              >
                Tout approuver
              </button>
              <button
                onClick={() => setApproved(new Set())}
                className="text-xs text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-full transition"
              >
                Tout rejeter
              </button>
              <button
                onClick={handleApply}
                disabled={approvedCount === 0 || applyMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gold-500 text-navy-900 rounded-full font-bold text-xs hover:bg-gold-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applyMutation.isPending ? "Application..." : `Appliquer ${approvedCount} modification${approvedCount > 1 ? "s" : ""}`}
              </button>
            </div>
          </div>

          <div className="divide-y divide-navy-50">
            {suggestions.map((s) => {
              const school = SCHOOLS_SNAPSHOT.find((sc) => sc.slug === s.slug);
              const isApproved = approved.has(s.slug);
              const gradeChanged = s.suggestedMinGrade !== s.currentMinGrade;
              const costChanged = s.suggestedCostMin !== s.currentCostMin || s.suggestedCostMax !== s.currentCostMax;
              return (
                <div key={s.slug} className={`p-4 transition ${isApproved ? "bg-emerald-50/30" : "bg-white"}`}>
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={isApproved}
                      onChange={() => toggleApprove(s.slug)}
                      className="mt-1 w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base">{TYPE_ICONS[school?.type ?? "university"] ?? "🎓"}</span>
                        <span className="font-semibold text-navy-800 text-sm">{school?.shortName ?? s.slug}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CONFIDENCE_COLORS[s.confidence]}`}>
                          {s.confidence === "high" ? "Haute confiance" : s.confidence === "medium" ? "Confiance moyenne" : "Faible confiance"}
                        </span>
                        {!gradeChanged && !costChanged && (
                          <span className="text-xs text-navy-400">Aucun changement</span>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs">
                        {gradeChanged && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-navy-400">Seuil:</span>
                            <span className="line-through text-navy-400">{s.currentMinGrade}/20</span>
                            <span>→</span>
                            <span className={`font-bold ${s.suggestedMinGrade > s.currentMinGrade ? "text-red-600" : "text-emerald-600"}`}>
                              {s.suggestedMinGrade}/20
                            </span>
                          </div>
                        )}
                        {costChanged && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-navy-400">Frais:</span>
                            <span className="line-through text-navy-400">{(s.currentCostMin / 1000).toFixed(0)}–{(s.currentCostMax / 1000).toFixed(0)}K</span>
                            <span>→</span>
                            <span className="font-bold text-navy-700">{(s.suggestedCostMin / 1000).toFixed(0)}–{(s.suggestedCostMax / 1000).toFixed(0)}K MAD/an</span>
                          </div>
                        )}
                        {s.source && (
                          <span className="text-navy-400">Source: {s.source}</span>
                        )}
                      </div>
                      {s.notes && (
                        <p className="mt-1.5 text-xs text-navy-500 italic">{s.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {applyMutation.isSuccess && (
            <div className="p-4 bg-emerald-50 border-t border-emerald-200 text-sm text-emerald-700">
              ✅ Modifications appliquées et sauvegardées dans KV Cloudflare.
            </div>
          )}
        </div>
      )}

      {/* Current schools table */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-navy-50 flex items-center justify-between">
          <h2 className="font-semibold text-navy-800">Données actuelles</h2>
          {kvLoading && <span className="text-xs text-navy-400">Chargement overrides...</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50/50 text-navy-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Établissement</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Filières</th>
                <th className="text-right px-4 py-3 font-medium">Seuil /20</th>
                <th className="text-right px-4 py-3 font-medium">Frais MAD/an</th>
                <th className="text-left px-4 py-3 font-medium">Override KV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {SCHOOLS_SNAPSHOT.map((s) => {
                const override = kvMap.get(s.slug);
                return (
                  <tr key={s.slug} className="hover:bg-navy-50/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>{TYPE_ICONS[s.type] ?? "🎓"}</span>
                        <div>
                          <div className="font-medium text-navy-800">{s.shortName}</div>
                          <div className="text-[11px] text-navy-400">{s.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-navy-100 text-navy-600 px-2 py-0.5 rounded-full">{s.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.tracks.map((t) => (
                          <span key={t} className="text-[10px] bg-gold-50 text-gold-700 border border-gold-200 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-mono font-bold ${override?.minGrade != null ? "text-gold-600" : "text-navy-700"}`}>
                        {override?.minGrade ?? s.currentMinGrade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-navy-600 font-mono text-xs">
                      {override?.annualCostMin != null
                        ? `${(override.annualCostMin / 1000).toFixed(0)}–${((override.annualCostMax ?? override.annualCostMin) / 1000).toFixed(0)}K`
                        : `${(s.currentCostMin / 1000).toFixed(0)}–${(s.currentCostMax / 1000).toFixed(0)}K`}
                    </td>
                    <td className="px-4 py-3">
                      {override ? (
                        <span className="text-xs text-gold-700 bg-gold-50 border border-gold-200 px-2 py-0.5 rounded-full">Override actif</span>
                      ) : (
                        <span className="text-xs text-navy-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
