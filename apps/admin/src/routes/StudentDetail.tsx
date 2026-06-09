import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";

const API_URL = import.meta.env.VITE_API_URL || "https://tawjih-api.hamzaelbouhali.workers.dev";

interface AiMatch {
  university_slug: string;
  probability: number;
  confidence: "high" | "medium" | "low";
  rationale: string;
  estimated_annual_cost_mad: number;
}

interface StudentProfile {
  uuid: string;
  bacTrack: string;
  generalGrade: number;
  mention: string;
  city: string;
  region: string;
  financialBracket: string;
  firstName: string | null;
  lastName: string | null;
  emailContact: string | null;
  mathGrade: number | null;
  physicsGrade: number | null;
  frenchGrade: number | null;
  arabicGrade: number | null;
  philosophyGrade: number | null;
  biologyGrade: number | null;
  economicsGrade: number | null;
  historyGrade: number | null;
  techGrade: number | null;
  englishGrade: number | null;
  englishGrade2: number | null;
  aiResults: {
    matches: AiMatch[];
    alternatives: Array<{ name: string; type: string; reason: string }>;
    suggested_tracks: string[];
  } | null;
  createdAt: number;
}

const CONF_STYLE: Record<string, string> = {
  high: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-rose-100 text-rose-800",
};

export default function StudentDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const token = useAuthStore((s) => s.token);
  const [selectedSchool, setSelectedSchool] = useState<AiMatch | null>(null);
  const [dossierLang, setDossierLang] = useState<"fr" | "ar">("fr");
  const [dossierResult, setDossierResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: profile, isLoading } = useQuery<StudentProfile>({
    queryKey: ["admin-profile", uuid],
    queryFn: () =>
      fetch(`${API_URL}/api/admin/profiles/${uuid}`, {
        headers: { Authorization: `Bearer ${token ?? ""}` },
      }).then((r) => r.json()),
    enabled: !!uuid,
  });

  const dossierMutation = useMutation({
    mutationFn: async ({ school, lang }: { school: AiMatch; lang: "fr" | "ar" }) => {
      const res = await fetch(`${API_URL}/api/admin/dossier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({
          profileUuid: uuid,
          schoolSlug: school.university_slug,
          schoolName: school.university_slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          language: lang,
        }),
      });
      return res.json();
    },
    onSuccess: (data) => setDossierResult(data.dossier ?? ""),
  });

  const handleCopy = () => {
    if (dossierResult) {
      navigator.clipboard.writeText(dossierResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-24">
        <div className="text-4xl mb-3">❌</div>
        <p className="text-navy-500">Profil introuvable.</p>
        <Link to="/profiles" className="mt-4 inline-flex text-sm text-gold-600 hover:text-gold-700">
          ← Retour aux profils
        </Link>
      </div>
    );
  }

  const studentName = profile.firstName && profile.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : "Étudiant(e) anonyme";

  const grades: Array<{ label: string; value: number | null }> = [
    { label: "Moyenne générale", value: profile.generalGrade },
    { label: "Mathématiques", value: profile.mathGrade },
    { label: "Physique-Chimie", value: profile.physicsGrade },
    { label: "Sciences de la Vie", value: profile.biologyGrade },
    { label: "Économie", value: profile.economicsGrade },
    { label: "Français", value: profile.frenchGrade },
    { label: "Arabe", value: profile.arabicGrade },
    { label: "Anglais", value: profile.englishGrade },
    { label: "Philosophie", value: profile.philosophyGrade },
    { label: "Sc. Tech. Industrielles", value: profile.techGrade },
    { label: "Histoire-Géographie", value: profile.historyGrade },
  ].filter((g) => g.value != null);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back */}
      <Link to="/profiles" className="inline-flex items-center gap-1 text-sm text-navy-400 hover:text-gold-600 transition mb-6">
        ← Retour aux profils
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-3xl p-6 text-white mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center text-navy-900 text-2xl font-bold flex-shrink-0">
          {profile.firstName ? profile.firstName[0].toUpperCase() : "?"}
        </div>
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold text-white">{studentName}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2.5 py-1 bg-gold-500/20 text-gold-300 rounded-lg text-xs font-bold">
              Bac {profile.bacTrack}
            </span>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold">
              {profile.mention}
            </span>
            <span className="px-2.5 py-1 bg-white/10 text-white/80 rounded-lg text-xs">
              {profile.city}, {profile.region}
            </span>
            {profile.emailContact && (
              <a href={`mailto:${profile.emailContact}`} className="px-2.5 py-1 bg-white/10 text-gold-200 rounded-lg text-xs hover:bg-white/20 transition">
                ✉️ {profile.emailContact}
              </a>
            )}
          </div>
        </div>
        <div className="text-center sm:text-right">
          <div className="font-heading text-3xl font-bold text-gold-400">{profile.generalGrade}/20</div>
          <div className="text-navy-300 text-xs mt-0.5">Moyenne générale</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grades panel */}
        <div className="bg-white rounded-3xl border border-gold-100/50 p-6 shadow-sm">
          <h3 className="font-heading font-bold text-navy-800 mb-5 flex items-center gap-2">
            <span>📚</span> Notes par matière
          </h3>
          <div className="space-y-3">
            {grades.map((g) => (
              <div key={g.label} className="flex items-center gap-3">
                <div className="w-36 text-xs text-navy-500 truncate flex-shrink-0">{g.label}</div>
                <div className="flex-1 h-2 bg-navy-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (g.value ?? 0) >= 16 ? "bg-emerald-500"
                      : (g.value ?? 0) >= 14 ? "bg-blue-500"
                      : (g.value ?? 0) >= 12 ? "bg-amber-500"
                      : "bg-rose-500"
                    }`}
                    style={{ width: `${((g.value ?? 0) / 20) * 100}%` }}
                  />
                </div>
                <div className="text-sm font-semibold text-navy-700 w-12 text-right flex-shrink-0">
                  {g.value}/20
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Matches */}
        <div className="bg-white rounded-3xl border border-gold-100/50 p-6 shadow-sm">
          <h3 className="font-heading font-bold text-navy-800 mb-5 flex items-center gap-2">
            <span>🎯</span> Matches IA — Écoles recommandées
          </h3>
          {!profile.aiResults?.matches?.length ? (
            <p className="text-sm text-navy-400 italic">Aucun résultat IA enregistré pour ce profil.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {profile.aiResults.matches.map((m) => (
                <button
                  key={m.university_slug}
                  type="button"
                  onClick={() => setSelectedSchool(selectedSchool?.university_slug === m.university_slug ? null : m)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    selectedSchool?.university_slug === m.university_slug
                      ? "border-gold-400 bg-gold-50"
                      : "border-navy-100 hover:border-gold-200 hover:bg-gold-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-navy-700 capitalize">
                        {m.university_slug.replace(/-/g, " ")}
                      </div>
                      <div className="text-[11px] text-navy-400 mt-0.5 line-clamp-2">{m.rationale}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="text-sm font-bold text-navy-800">{Math.round(m.probability * 100)}%</div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${CONF_STYLE[m.confidence]}`}>
                        {m.confidence}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dossier generator */}
        <div className="lg:col-span-2 bg-gradient-to-br from-navy-50 to-gold-50/30 rounded-3xl border border-gold-200 p-6">
          <h3 className="font-heading font-bold text-navy-800 mb-2 flex items-center gap-2">
            <span>📄</span> Générer le dossier de candidature
          </h3>
          <p className="text-sm text-navy-500 mb-5">
            Sélectionne une école dans la liste ci-dessus, puis génère un dossier complet prêt à soumettre.
          </p>

          {selectedSchool ? (
            <div className="bg-white rounded-2xl border border-gold-200 p-4 mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-gold-600 uppercase tracking-wider mb-0.5">École sélectionnée</div>
                <div className="font-semibold text-navy-800 capitalize">
                  {selectedSchool.university_slug.replace(/-/g, " ")}
                </div>
                <div className="text-xs text-navy-400 mt-0.5">
                  Probabilité: {Math.round(selectedSchool.probability * 100)}% ·
                  Coût estimé: {selectedSchool.estimated_annual_cost_mad.toLocaleString()} MAD/an
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSchool(null)}
                className="text-navy-300 hover:text-navy-600 transition p-1"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 mb-4">
              👆 Clique sur une école dans la liste "Matches IA" pour la sélectionner
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-navy-600 font-medium">Langue du dossier :</span>
            {(["fr", "ar"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setDossierLang(lang)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                  dossierLang === lang
                    ? "bg-navy-800 text-gold-200"
                    : "bg-white border border-navy-200 text-navy-600 hover:border-gold-300"
                }`}
              >
                {lang === "fr" ? "🇫🇷 Français" : "🇲🇦 Arabe"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => selectedSchool && dossierMutation.mutate({ school: selectedSchool, lang: dossierLang })}
            disabled={!selectedSchool || dossierMutation.isPending}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold rounded-xl hover:from-gold-400 hover:to-gold-300 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md shadow-gold-500/20 flex items-center gap-2"
          >
            {dossierMutation.isPending ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Génération IA en cours…
              </>
            ) : (
              <>✨ Générer le dossier complet</>
            )}
          </button>

          {/* Generated dossier */}
          {dossierResult && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-heading font-bold text-navy-800">Dossier généré</h4>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gold-200 text-navy-600 hover:bg-gold-50 transition"
                >
                  {copied ? "✓ Copié !" : "📋 Copier"}
                </button>
              </div>
              <div className="bg-white border border-navy-100 rounded-2xl p-6 text-sm text-navy-700 leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto font-mono text-xs">
                {dossierResult}
              </div>
            </div>
          )}
        </div>

        {/* Suggested tracks */}
        {profile.aiResults?.suggested_tracks && profile.aiResults.suggested_tracks.length > 0 && (
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gold-100/50 p-6 shadow-sm">
            <h3 className="font-heading font-bold text-navy-800 mb-4 flex items-center gap-2">
              <span>🗺️</span> Parcours suggérés
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.aiResults.suggested_tracks.map((track) => (
                <span
                  key={track}
                  className="px-3 py-2 bg-navy-50 border border-navy-100 rounded-xl text-sm text-navy-700 font-medium"
                >
                  {track}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
