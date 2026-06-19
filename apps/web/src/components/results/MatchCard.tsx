import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProbabilityRing from "./ProbabilityRing";
import { getSchoolBySlug, TIER_COLORS, ADMISSION_COLORS } from "../../data/schools";
import { useProgressStore } from "../../stores/progressStore";
import { useCompareStore } from "../../stores/compareStore";
import { useWishlistStore } from "../../stores/wishlistStore";
import { CAREERS_DATA } from "../../data/careers";

interface Match {
  university_slug: string;
  probability: number;
  confidence: string;
  rationale: string;
  estimated_annual_cost_mad: number;
}

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
  const { toggle: compareToggle, has: inCompare, schools: compareSchools } = useCompareStore();
  const { toggle: wishlistToggle, has: wishlistHas } = useWishlistStore();

  const school = getSchoolBySlug(match.university_slug);
  const legacy = LEGACY_SCHOOLS[match.university_slug];
  const careers = CAREERS_DATA[match.university_slug];

  const shortName = school?.shortName ?? legacy?.shortName ?? match.university_slug;
  const city = school?.city ?? legacy?.city ?? "Maroc";
  const tier = (school?.tier ?? legacy?.tier ?? "standard") as keyof typeof TIER_COLORS;
  const icon = school?.icon ?? legacy?.icon ?? "🏛️";
  const access = school?.access ?? "private";
  const programs = school?.programs?.slice(0, 3) ?? [];
  const highlights = school?.highlights?.slice(0, 2) ?? [];
  const hasCampus = school?.hasCampus ?? false;
  const campusDetails = school?.campusDetails;
  const jobFamilies = school?.jobFamilies ?? [];

  const tierStyle = TIER_COLORS[tier] || TIER_COLORS.standard;
  const admissionMode = school?.admission;
  const admissionStyle = admissionMode ? ADMISSION_COLORS[admissionMode] : null;

  const rankColors = ["from-amber-400 to-amber-500", "from-slate-400 to-slate-500", "from-amber-600/70 to-amber-700/70"];

  const isCompared = school ? inCompare(school.slug) : false;
  const compareDisabled = !isCompared && compareSchools.length >= 3;
  const inWishlist = school ? wishlistHas(school.slug) : false;

  // Cost display: use API value if non-zero, else fall back to school data range
  const apiCost = match.estimated_annual_cost_mad;
  const schoolCost = school?.annualCostMAD;
  const costNode = (() => {
    if (apiCost && apiCost > 0) {
      return <>{apiCost.toLocaleString()} <span className="text-navy-400 font-normal text-[9px]">MAD/an</span></>;
    }
    if (schoolCost) {
      if (schoolCost[0] === 0) {
        return <span className="text-emerald-600">{t("match.cost.free")}</span>;
      }
      return (
        <>
          {schoolCost[0].toLocaleString()}
          {schoolCost[1] > schoolCost[0] && <>–{schoolCost[1].toLocaleString()}</>}
          {" "}<span className="text-navy-400 font-normal text-[9px]">MAD/an</span>
        </>
      );
    }
    return <span className="text-navy-400 text-[10px]">—</span>;
  })();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative flex flex-col h-full rounded-2xl border overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 ${tierStyle.border}`}
    >
      {/* ── Rank badge ── */}
      {rank !== undefined && rank < 3 && (
        <div className={`absolute top-3 left-3 z-10 w-7 h-7 rounded-xl bg-gradient-to-br ${rankColors[rank]} text-white text-xs font-heading font-bold flex items-center justify-center shadow-md`}>
          #{rank + 1}
        </div>
      )}

      {/* ── Wishlist heart ── */}
      {school && (
        <button
          type="button"
          onClick={() => wishlistToggle(school.slug)}
          className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
            inWishlist
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white/80 text-navy-300 hover:text-rose-400 border border-gray-200 hover:border-rose-200"
          }`}
          title={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <svg className="w-3.5 h-3.5" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      )}

      {/* ── Header ── */}
      <div className={`px-4 pt-4 pb-3 ${tierStyle.bg} border-b ${tierStyle.border}`}>
        {/* School identity + probability ring */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0 mt-0.5">
            <div className={`w-10 h-10 rounded-xl ${tierStyle.bg} border ${tierStyle.border} flex items-center justify-center text-xl flex-shrink-0`}>
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-navy-800 text-sm leading-tight truncate pr-6">{shortName}</h3>
              <p className="text-navy-500 text-[11px] mt-0.5 flex items-center gap-1">
                <svg className="w-2.5 h-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="truncate">{city}</span>
              </p>
            </div>
          </div>
          <ProbabilityRing probability={match.probability} size={54} />
        </div>

        {/* Badges — compact row */}
        <div className="flex flex-wrap gap-1 mt-2.5">
          <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
            {t(`tier.${tier}`)}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/70 border border-gray-200 text-navy-500 font-medium">
            {school ? t(`type.${school.type}`) : t("type.university")}
          </span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
            access === "public" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
            access === "semi-public" ? "bg-blue-50 text-blue-700 border border-blue-200" :
            "bg-amber-50 text-amber-700 border border-amber-200"
          }`}>
            {t(`access.${access}`)}
          </span>
          {admissionMode && admissionStyle && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${admissionStyle.bg} ${admissionStyle.text} ${admissionStyle.border}`}>
              {t(`admission.${admissionMode}.label`)}
            </span>
          )}
          {hasCampus && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold border bg-teal-50 text-teal-700 border-teal-200">
              🏫 Campus
            </span>
          )}
        </div>

        {/* Campus housing summary */}
        {campusDetails && (campusDetails.housing || campusDetails.sports) && (
          <div className="mt-2 flex items-center gap-2 text-[10px] text-navy-500">
            <span className="font-medium text-navy-600">Campus</span>
            {campusDetails.size && <span className="text-navy-400">{campusDetails.size}</span>}
            {campusDetails.housing && <span className="text-emerald-600 font-medium">· 🏠 {t("match.campus.housing")}</span>}
            {campusDetails.sports && <span className="text-blue-600 font-medium">· ⚽ {t("match.campus.sports")}</span>}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="px-4 py-3 flex-1 flex flex-col gap-3">
        {/* AI rationale */}
        <p className="text-xs text-navy-500 leading-relaxed flex-none line-clamp-3">
          {match.rationale}
        </p>

        {/* Salary & employment — careers insight row */}
        {careers && (
          <div className="flex items-center gap-2 py-2 px-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex-1">
              <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Salaire départ</div>
              <div className="text-xs font-bold text-emerald-800">{careers.avgStartSalaryMAD.toLocaleString()} MAD</div>
            </div>
            <div className="w-px h-6 bg-emerald-200" />
            <div className="flex-1">
              <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Taux emploi</div>
              <div className="text-xs font-bold text-emerald-800">{careers.employmentRate}%</div>
            </div>
          </div>
        )}

        {/* Programs */}
        {programs.length > 0 && (
          <div>
            <div className="text-[9px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">{t("match.programs")}</div>
            <div className="flex flex-wrap gap-1">
              {programs.map((p) => (
                <span key={p} className="text-[9px] px-1.5 py-0.5 bg-navy-50 text-navy-600 rounded border border-navy-100 font-medium leading-tight">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-1.5 text-[10px] text-navy-500">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tierStyle.dot}`} />
                {h}
              </div>
            ))}
          </div>
        )}

        {/* Job families — clickable */}
        {jobFamilies.length > 0 && (
          <div>
            <div className="text-[9px] font-bold text-navy-400 uppercase tracking-wider mb-1.5">{t("match.job_families")}</div>
            <div className="flex flex-wrap gap-1">
              {jobFamilies.slice(0, 3).map((jf) => {
                const viewed = viewedJobFamilies.includes(jf);
                return (
                  <button
                    key={jf}
                    type="button"
                    onClick={() => markJobFamilyViewed(jf)}
                    className={`text-[9px] px-1.5 py-0.5 rounded border font-medium transition-colors leading-tight flex items-center gap-0.5 ${
                      viewed ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      "bg-gold-50 text-gold-800 border-gold-200 hover:border-gold-400"
                    }`}
                  >
                    {viewed && <span className="text-emerald-500 text-[8px]">✓</span>}
                    {jf}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Cost + Confidence row */}
        <div className="flex items-center justify-between py-2 px-3 bg-navy-50/60 rounded-xl mt-auto">
          <div>
            <div className="text-[9px] font-bold text-navy-400 uppercase tracking-wide">{t("match.cost")}</div>
            <div className="font-heading font-bold text-navy-800 text-xs mt-0.5">
              {costNode}
            </div>
          </div>
          <div className={`text-[9px] font-bold px-2 py-1 rounded-full ${
            match.confidence === "high" ? "bg-emerald-100 text-emerald-700" :
            match.confidence === "medium" ? "bg-amber-100 text-amber-700" :
            "bg-slate-100 text-slate-600"
          }`}>
            {match.confidence === "high" ? t("match.confidence.high") :
             match.confidence === "medium" ? t("match.confidence.medium") :
             t("match.confidence.low")}
          </div>
        </div>

        {/* ── CTA row: View + Compare ── */}
        <div className="grid grid-cols-2 gap-2">
          {school ? (
            <Link
              to={`/ecoles/${school.slug}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-navy-800 text-gold-200 rounded-xl font-bold text-xs hover:bg-navy-900 transition-colors"
            >
              {t("match.view_school")}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => (window as any).__slimaneOpen?.()}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-navy-800 text-gold-200 rounded-xl font-bold text-xs hover:bg-navy-900 transition-colors"
            >
              Slimane 🤖
            </button>
          )}

          {/* Compare toggle */}
          {school ? (
            <button
              type="button"
              onClick={() => compareToggle(school)}
              disabled={compareDisabled}
              title={compareDisabled ? t("compare.full") : isCompared ? t("compare.added") : t("compare.add")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isCompared
                  ? "bg-gold-500 text-navy-900 hover:bg-gold-400"
                  : compareDisabled
                    ? "bg-white border border-gray-200 text-gray-300 cursor-not-allowed"
                    : "bg-white border border-gold-300 text-gold-700 hover:bg-gold-50"
              }`}
            >
              <span className="text-sm leading-none">⚖</span>
              <span className="hidden xs:inline">
                {isCompared ? t("compare.added") : t("compare.add")}
              </span>
              {!isCompared && !compareDisabled && (
                <span className="xs:hidden text-[9px]">{t("compare.add")}</span>
              )}
            </button>
          ) : (
            <Link
              to="/comparer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-gold-300 text-gold-700 rounded-xl font-bold text-xs hover:bg-gold-50 transition-colors"
            >
              <span>⚖</span>
              <span className="text-[10px]">{t("compare.bar.cta")}</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
