import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormStore } from "../stores/formStore";
import MatchCard from "../components/results/MatchCard";
import AlternativeList from "../components/results/AlternativeList";
import OrientationReadiness from "../components/results/OrientationReadiness";
import { getSchoolBySlug } from "../data/schools";
import { useCompareStore } from "../stores/compareStore";

interface LocationState {
  matches: Array<{
    university_slug: string;
    probability: number;
    confidence: string;
    rationale: string;
    estimated_annual_cost_mad: number;
  }>;
  alternatives: Array<{ name: string; type: string; reason: string }>;
  suggested_tracks: string[];
}

type SortKey = "compatibility" | "cost" | "tier";

const TIER_ORDER: Record<string, number> = {
  elite: 0, premium: 1, selective: 2, standard: 3, accessible: 4,
};

export default function Results() {
  const location = useLocation();
  const { t } = useTranslation();
  const state = location.state as LocationState | null;
  const [sort, setSort] = useState<SortKey>("compatibility");
  const { schools: compareSchools } = useCompareStore();

  const hasMatches = state?.matches && state.matches.length > 0;
  const topMatch = hasMatches ? state.matches[0] : null;
  const topSchool = topMatch ? getSchoolBySlug(topMatch.university_slug) : null;
  const topName = topSchool?.shortName ?? topMatch?.university_slug ?? "";

  const sortedMatches = hasMatches
    ? [...state!.matches].sort((a, b) => {
        if (sort === "cost") return a.estimated_annual_cost_mad - b.estimated_annual_cost_mad;
        if (sort === "tier") {
          const ta = getSchoolBySlug(a.university_slug)?.tier ?? "standard";
          const tb = getSchoolBySlug(b.university_slug)?.tier ?? "standard";
          return (TIER_ORDER[ta] ?? 3) - (TIER_ORDER[tb] ?? 3);
        }
        return b.probability - a.probability;
      })
    : [];

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "compatibility", label: t("results.sort.compatibility") },
    { key: "cost", label: t("results.sort.cost") },
    { key: "tier", label: t("results.sort.tier") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cream"
    >
      {/* ─── Compact hero — no internal UUID ─── */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 text-white pt-8 pb-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, delay: 0.1 }}
              className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-xl shadow-gold-500/20 flex-shrink-0"
            >
              <svg className="w-6 h-6 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="font-heading text-xl md:text-3xl font-bold leading-tight"
              >
                {t("results.title")}
              </motion.h1>
              {hasMatches && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-navy-300 text-sm mt-0.5"
                >
                  {sortedMatches.length > 1
                    ? t("results.count_plural", { count: sortedMatches.length })
                    : t("results.count", { count: sortedMatches.length })}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 pb-32 sm:pb-8">

        {/* ─── Top match spotlight ─── */}
        {topMatch && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            {topSchool ? (
              <Link
                to={`/ecoles/${topSchool.slug}`}
                className="group p-4 bg-gradient-to-r from-gold-50 to-gold-100/40 border border-gold-200 rounded-2xl flex items-center gap-3 hover:border-gold-400 transition-colors"
              >
                <span className="text-2xl flex-shrink-0">🏆</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-gold-700 uppercase tracking-wider">{t("results.best_match")}</div>
                  <div className="font-heading font-bold text-navy-800 text-sm md:text-base truncate">
                    {topName} — {Math.round(topMatch.probability * 100)}% {t("match.probability").toLowerCase()}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gold-600 flex-shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <div className="p-4 bg-gradient-to-r from-gold-50 to-gold-100/40 border border-gold-200 rounded-2xl flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">🏆</span>
                <div>
                  <div className="text-[10px] font-bold text-gold-700 uppercase tracking-wider">{t("results.best_match")}</div>
                  <div className="font-heading font-bold text-navy-800 text-sm">{topName} — {Math.round(topMatch.probability * 100)}%</div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Quick actions ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6 grid grid-cols-2 gap-3"
        >
          <button
            type="button"
            onClick={() => (window as any).__slimaneOpen?.()}
            className="flex items-center gap-2.5 p-3.5 bg-navy-800 text-white rounded-2xl hover:bg-navy-900 transition-colors text-left"
          >
            <span className="text-lg flex-shrink-0">🤖</span>
            <div className="min-w-0">
              <div className="font-bold text-sm leading-tight">{t("cta.chat_slimane")}</div>
              <div className="text-navy-400 text-[10px] mt-0.5 hidden sm:block">{t("results.slimane_desc")}</div>
            </div>
          </button>

          <Link
            to="/orientation"
            onClick={() => useFormStore.getState().reset()}
            className="flex items-center gap-2.5 p-3.5 bg-white border border-gold-200 rounded-2xl hover:border-gold-400 transition-colors text-left"
          >
            <span className="text-lg flex-shrink-0">🔄</span>
            <div className="min-w-0">
              <div className="font-bold text-sm text-navy-800 leading-tight">{t("results.restart")}</div>
              <div className="text-navy-400 text-[10px] mt-0.5 hidden sm:block">{t("results.restart_desc")}</div>
            </div>
          </Link>
        </motion.div>

        {/* ─── Matches section ─── */}
        {hasMatches ? (
          <>
            {/* Sort bar + Compare CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-5"
            >
              {/* Sort pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-navy-400 font-medium flex-shrink-0">{t("results.sort.label")} :</span>
                <div className="flex gap-1.5 flex-wrap">
                  {SORT_OPTIONS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSort(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        sort === key
                          ? "bg-navy-800 text-gold-200 shadow-sm"
                          : "bg-white border border-gold-100 text-navy-500 hover:border-gold-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile compare CTA — only show when schools in compare */}
              {compareSchools.length > 0 && (
                <Link
                  to="/comparer"
                  className="mt-3 flex items-center gap-3 px-4 py-2.5 bg-gold-50 border border-gold-300 rounded-xl hover:bg-gold-100 transition-colors"
                >
                  <span className="text-base">⚖</span>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-navy-800">{t("results.compare.banner")}</span>
                    <span className="ml-2 text-[10px] text-gold-700 font-bold bg-gold-200 px-1.5 py-0.5 rounded-full">
                      {compareSchools.length}/3
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gold-700 flex-shrink-0">{t("results.compare.cta")}</span>
                </Link>
              )}

              {/* Invite to use compare when no schools selected yet */}
              {compareSchools.length === 0 && (
                <p className="mt-2 text-[11px] text-navy-400 flex items-center gap-1.5">
                  <span>⚖</span>
                  <span>
                    {t("results.compare.banner")} — {t("compare.add")} depuis chaque carte
                  </span>
                </p>
              )}
            </motion.div>

            {/* Cards — single column on mobile, 2 on md, 3 on lg */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {sortedMatches.map((match, idx) => (
                <motion.div
                  key={match.university_slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="h-full"
                >
                  <MatchCard match={match} rank={idx} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <AlternativeList alternatives={state?.alternatives ?? []} />
        )}

        {/* Suggested tracks */}
        {state?.suggested_tracks && state.suggested_tracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-5 bg-white rounded-2xl border border-gold-100/60 shadow-sm"
          >
            <h3 className="font-heading font-bold text-navy-800 mb-3 flex items-center gap-2 text-base">
              <span>🎯</span>
              {t("results.tracks_title")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {state.suggested_tracks.map((track) => (
                <span
                  key={track}
                  className="px-3 py-1.5 bg-navy-50 rounded-full text-xs font-medium text-navy-700 border border-navy-100"
                >
                  {track}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Orientation readiness */}
        <div className="mt-8">
          <OrientationReadiness topSchool={topSchool} />
        </div>

        {/* Legal disclaimer */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <span className="text-amber-500 flex-shrink-0 mt-0.5 text-sm">⚠️</span>
          <p className="text-xs text-amber-800 leading-relaxed">{t("results.disclaimer")}</p>
        </div>
      </div>
    </motion.div>
  );
}
