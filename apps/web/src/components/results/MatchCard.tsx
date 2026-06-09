import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProbabilityRing from "./ProbabilityRing";
import OptInModal from "./OptInModal";
import { useGameStore } from "../../stores/gameStore";
import { getSchoolBySlug, TIER_COLORS, TIER_LABELS, TYPE_LABELS, ADMISSION_LABELS, ADMISSION_COLORS } from "../../data/schools";

interface Match {
  university_slug: string;
  probability: number;
  confidence: string;
  rationale: string;
  estimated_annual_cost_mad: number;
}

// Fallback school data for slugs not in the data file
const LEGACY_SCHOOLS: Record<string, { name: string; shortName: string; city: string; tier: string; icon: string }> = {
  "universite-mundiapolis": { name: "Université Mundiapolis", shortName: "Mundiapolis", city: "Casablanca", tier: "selective", icon: "🌐" },
  "heec": { name: "HEEC", shortName: "HEEC", city: "Casablanca", tier: "premium", icon: "🏛️" },
  "isiam": { name: "ISIAM", shortName: "ISIAM", city: "Casablanca", tier: "standard", icon: "🏫" },
  "universite-privee-tanger": { name: "Univ. Privée de Tanger", shortName: "UPT", city: "Tanger", tier: "accessible", icon: "🏫" },
};

export default function MatchCard({ match, rank }: { match: Match; rank?: number }) {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const addXp = useGameStore((s) => s.addXp);
  const awardBadge = useGameStore((s) => s.awardBadge);

  const school = getSchoolBySlug(match.university_slug);
  const legacy = LEGACY_SCHOOLS[match.university_slug];

  const name = school?.name ?? legacy?.name ?? match.university_slug;
  const shortName = school?.shortName ?? legacy?.shortName ?? match.university_slug;
  const city = school?.city ?? legacy?.city ?? "Maroc";
  const tier = (school?.tier ?? legacy?.tier ?? "standard") as keyof typeof TIER_COLORS;
  const icon = school?.icon ?? legacy?.icon ?? "🏛️";
  const type = school ? TYPE_LABELS[school.type] : "Établissement";
  const access = school?.access ?? "private";
  const programs = school?.programs?.slice(0, 3) ?? [];
  const highlights = school?.highlights?.slice(0, 2) ?? [];
  const website = school?.website;

  const tierStyle = TIER_COLORS[tier] || TIER_COLORS.standard;
  const admissionMode = school?.admission;
  const admissionStyle = admissionMode ? ADMISSION_COLORS[admissionMode] : null;
  const admissionLabel = admissionMode ? ADMISSION_LABELS[admissionMode] : null;

  const handleOptIn = () => {
    addXp(25, "Opted in to university");
    awardBadge("optin_hero");
    setShowModal(true);
  };

  const rankColors = ["from-amber-400 to-amber-500", "from-slate-400 to-slate-500", "from-amber-600/70 to-amber-700/70"];

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        className={`relative flex flex-col rounded-3xl border overflow-hidden shadow-md hover:shadow-xl hover:shadow-navy-900/8 transition-all duration-300 bg-white ${tierStyle.border}`}
      >
        {/* Rank badge */}
        {rank !== undefined && rank < 3 && (
          <div className={`absolute top-4 left-4 z-10 w-8 h-8 rounded-xl bg-gradient-to-br ${rankColors[rank]} text-white text-xs font-heading font-bold flex items-center justify-center shadow-lg`}>
            #{rank + 1}
          </div>
        )}

        {/* Tier ribbon */}
        <div className={`px-5 pt-5 pb-3 ${tierStyle.bg} border-b ${tierStyle.border}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-12 h-12 rounded-2xl ${tierStyle.bg} border ${tierStyle.border} flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}>
                {icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-navy-800 text-base leading-tight truncate">{shortName}</h3>
                <p className="text-navy-500 text-xs mt-0.5 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="truncate">{city}</span>
                </p>
              </div>
            </div>
            <ProbabilityRing probability={match.probability} size={60} />
          </div>

          {/* Tier + type badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
              {TIER_LABELS[tier]}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/70 border border-gray-200 text-navy-500 font-medium">
              {type}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              access === "public"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : access === "semi-public"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}>
              {access === "public" ? "Public" : access === "semi-public" ? "Semi-pub." : "Privé"}
            </span>
            {admissionLabel && admissionStyle && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${admissionStyle.bg} ${admissionStyle.text} ${admissionStyle.border}`}>
                {admissionLabel}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex-1 flex flex-col">
          {/* Rationale */}
          <p className="text-sm text-navy-500 leading-relaxed mb-4 flex-1">
            {match.rationale}
          </p>

          {/* Programs */}
          {programs.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">Filières disponibles</div>
              <div className="flex flex-wrap gap-1.5">
                {programs.map((p) => (
                  <span key={p} className="text-[10px] px-2 py-1 bg-navy-50 text-navy-600 rounded-lg border border-navy-100 font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="flex flex-col gap-1 mb-4">
              {highlights.map((h) => (
                <div key={h} className="flex items-center gap-2 text-xs text-navy-500">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tierStyle.dot}`} />
                  {h}
                </div>
              ))}
            </div>
          )}

          {/* Cost */}
          <div className="flex items-center justify-between p-3 bg-navy-50/60 rounded-xl mb-4">
            <div className="text-xs text-navy-400 font-medium uppercase tracking-wide">{t("match.cost")}</div>
            <div className="font-heading font-bold text-navy-800 text-sm">
              {match.estimated_annual_cost_mad === 0
                ? <span className="text-emerald-600">{t("match.cost.free")}</span>
                : <>{match.estimated_annual_cost_mad.toLocaleString()} <span className="text-navy-400 font-normal">MAD</span></>
              }
            </div>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-2 mb-4">
            <div className="text-xs text-navy-400">{t("match.confidence.label")} :</div>
            <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              match.confidence === "high" ? "bg-emerald-100 text-emerald-700" :
              match.confidence === "medium" ? "bg-amber-100 text-amber-700" :
              "bg-slate-100 text-slate-600"
            }`}>
              {match.confidence === "high" ? t("match.confidence.high") : match.confidence === "medium" ? t("match.confidence.medium") : t("match.confidence.low")}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={handleOptIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 text-sm font-bold hover:from-navy-800 hover:to-navy-900 transition-all shadow-md shadow-navy-900/15 touch-target flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {access === "private" || access === "semi-public"
                ? t("match.request_info")
                : t("match.submit_dossier")}
            </motion.button>
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl border border-navy-200 text-navy-500 text-xs font-medium hover:bg-navy-50 transition-all flex items-center justify-center gap-1.5 touch-target"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Site officiel
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {showModal && <OptInModal universityName={name} onClose={() => setShowModal(false)} />}
    </>
  );
}
