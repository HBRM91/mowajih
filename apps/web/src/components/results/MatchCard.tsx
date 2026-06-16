import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProbabilityRing from "./ProbabilityRing";
import { getSchoolBySlug, TIER_COLORS, ADMISSION_COLORS } from "../../data/schools";
import { useProgressStore } from "../../stores/progressStore";

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
  const { t } = useTranslation();
  const viewedJobFamilies = useProgressStore((s) => s.viewedJobFamilies);
  const markJobFamilyViewed = useProgressStore((s) => s.markJobFamilyViewed);

  const school = getSchoolBySlug(match.university_slug);
  const legacy = LEGACY_SCHOOLS[match.university_slug];

  const shortName = school?.shortName ?? legacy?.shortName ?? school?.name ?? legacy?.name ?? match.university_slug;
  const city = school?.city ?? legacy?.city ?? "Maroc";
  const tier = (school?.tier ?? legacy?.tier ?? "standard") as keyof typeof TIER_COLORS;
  const icon = school?.icon ?? legacy?.icon ?? "🏛️";
  const access = school?.access ?? "private";
  const programs = school?.programs?.slice(0, 4) ?? [];
  const highlights = school?.highlights?.slice(0, 2) ?? [];
  const hasCampus = school?.hasCampus ?? false;
  const campusDetails = school?.campusDetails;
  const jobFamilies = school?.jobFamilies ?? [];

  const tierStyle = TIER_COLORS[tier] || TIER_COLORS.standard;
  const admissionMode = school?.admission;
  const admissionStyle = admissionMode ? ADMISSION_COLORS[admissionMode] : null;

  const rankColors = ["from-amber-400 to-amber-500", "from-slate-400 to-slate-500", "from-amber-600/70 to-amber-700/70"];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`relative flex flex-col h-full rounded-3xl border overflow-hidden shadow-md hover:shadow-xl hover:shadow-navy-900/8 transition-all duration-300 bg-white ${tierStyle.border}`}
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
              {t(`tier.${tier}`)}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/70 border border-gray-200 text-navy-500 font-medium">
              {school ? t(`type.${school.type}`) : t("type.university")}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              access === "public"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : access === "semi-public"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}>
              {t(`access.${access}`)}
            </span>
            {admissionMode && admissionStyle && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${admissionStyle.bg} ${admissionStyle.text} ${admissionStyle.border}`}>
                {t(`admission.${admissionMode}.label`)}
              </span>
            )}
            {hasCampus && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border bg-teal-50 text-teal-700 border-teal-200 flex items-center gap-1">
                🏫 Campus
              </span>
            )}
          </div>
          {/* Campus details */}
          {campusDetails && (
            <div className="mt-2.5 text-[11px] text-navy-500 bg-white/60 rounded-xl px-3 py-2 border border-white/80 leading-relaxed">
              <span className="font-bold text-navy-700">Campus</span>
              {campusDetails.size && <span className="ml-1 text-navy-400">· {campusDetails.size}</span>}
              {campusDetails.housing && <span className="ml-1 text-emerald-600 font-medium">· 🏠 {t("match.campus.housing")}</span>}
              {campusDetails.sports && <span className="ml-1 text-blue-600 font-medium">· ⚽ {t("match.campus.sports")}</span>}
              <span className="block mt-0.5 text-navy-400">{campusDetails.description}</span>
            </div>
          )}
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
              <div className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">{t("match.programs")}</div>
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

          {/* Job families */}
          {jobFamilies.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">{t("match.job_families")}</div>
              <div className="flex flex-wrap gap-1.5">
                {jobFamilies.slice(0, 4).map((jf) => {
                  const viewed = viewedJobFamilies.includes(jf);
                  return (
                    <button
                      key={jf}
                      type="button"
                      onClick={() => markJobFamilyViewed(jf)}
                      className={`text-[10px] px-2 py-1 rounded-lg border font-medium transition-colors flex items-center gap-1 ${
                        viewed
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gold-50 text-gold-800 border-gold-200 hover:border-gold-400"
                      }`}
                    >
                      {viewed && <span className="text-emerald-500">✓</span>}
                      {jf}
                    </button>
                  );
                })}
              </div>
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

          {/* School profile pivot action — always present for visual consistency across cards */}
          {school ? (
            <Link
              to={`/ecoles/${school.slug}`}
              className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-800 text-gold-200 rounded-xl font-bold text-sm hover:bg-navy-900 transition-colors"
            >
              {t("match.view_school")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => (window as any).__slimaneOpen?.()}
              className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-800 text-gold-200 rounded-xl font-bold text-sm hover:bg-navy-900 transition-colors"
            >
              {t("match.ask_slimane")}
              <span>🤖</span>
            </button>
          )}

        </div>
      </motion.div>

  );
}
