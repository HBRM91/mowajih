import { motion } from "framer-motion";
import { useParams, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormStore } from "../stores/formStore";
import MatchCard from "../components/results/MatchCard";
import AlternativeList from "../components/results/AlternativeList";
import OrientationReadiness from "../components/results/OrientationReadiness";
import { getSchoolBySlug } from "../data/schools";

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

export default function Results() {
  const { uuid } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const state = location.state as LocationState | null;

  const hasMatches = state?.matches && state.matches.length > 0;
  const topMatch = hasMatches ? state.matches[0] : null;
  const topSchool = topMatch ? getSchoolBySlug(topMatch.university_slug) : null;
  const topName = topSchool?.shortName ?? topMatch?.university_slug ?? "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cream"
    >
      {/* Hero header */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl mb-5 shadow-xl shadow-gold-500/20"
          >
            <svg className="w-8 h-8 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-3xl md:text-5xl font-bold mb-3"
          >
            {t("results.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-navy-300 text-sm"
          >
            {t("results.ai_ref")}&nbsp;
            <span className="font-mono text-gold-300 text-xs">{uuid?.slice(0, 8)}…</span>
          </motion.p>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Top match spotlight */}
        {topMatch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {topSchool ? (
              <Link
                to={`/ecoles/${topSchool.slug}`}
                className="group mb-4 p-5 bg-gradient-to-r from-gold-50 to-gold-100/30 border border-gold-200 rounded-2xl flex items-center gap-4 hover:border-gold-400 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-navy-900 text-xl flex-shrink-0">
                  🏆
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gold-700 uppercase tracking-wider">{t("results.best_match")}</div>
                  <div className="font-heading font-bold text-navy-800 text-base truncate">
                    {topName} — {Math.round(topMatch.probability * 100)}% {t("match.probability").toLowerCase()}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gold-600 flex-shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <div className="mb-4 p-5 bg-gradient-to-r from-gold-50 to-gold-100/30 border border-gold-200 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-navy-900 text-xl flex-shrink-0">
                  🏆
                </div>
                <div>
                  <div className="text-xs font-bold text-gold-700 uppercase tracking-wider">{t("results.best_match")}</div>
                  <div className="font-heading font-bold text-navy-800 text-base">
                    {topName} — {Math.round(topMatch.probability * 100)}% {t("match.probability").toLowerCase()}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Quick actions: Slimane + restart, right under the top match */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <button
            type="button"
            onClick={() => (window as any).__slimaneOpen?.()}
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-navy-800 to-navy-900 text-white rounded-2xl hover:from-navy-900 hover:to-navy-950 transition-colors text-left"
          >
            <span className="text-xl flex-shrink-0">🤖</span>
            <div className="min-w-0">
              <div className="font-heading font-bold text-sm">{t("cta.chat_slimane")}</div>
              <div className="text-navy-300 text-xs mt-0.5 hidden sm:block leading-snug">{t("results.slimane_desc")}</div>
            </div>
          </button>

          <Link
            to="/orientation"
            onClick={() => useFormStore.getState().reset()}
            className="flex items-center gap-3 p-4 bg-white border border-gold-200 rounded-2xl hover:border-gold-400 transition-colors text-left"
          >
            <span className="text-xl flex-shrink-0">🔄</span>
            <div className="min-w-0">
              <div className="font-heading font-bold text-sm text-navy-800">{t("results.restart")}</div>
              <div className="text-navy-400 text-xs mt-0.5 hidden sm:block leading-snug">{t("results.restart_desc")}</div>
            </div>
          </Link>
        </motion.div>

        {/* Matches grid */}
        {hasMatches ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-navy-800">
                {state.matches.length > 1
                  ? t("results.count_plural", { count: state.matches.length })
                  : t("results.count", { count: state.matches.length })}
              </h2>
              <span className="text-xs text-navy-400 bg-white border border-gold-100 px-3 py-1.5 rounded-full font-medium">
                {t("results.sorted")}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {state.matches.map((match, idx) => (
                <motion.div
                  key={match.university_slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 p-6 bg-white rounded-3xl border border-gold-100/60 shadow-sm"
          >
            <h3 className="font-heading font-bold text-navy-800 mb-4 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              {t("results.tracks_title")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {state.suggested_tracks.map((track) => (
                <span
                  key={track}
                  className="px-4 py-2 bg-gradient-to-br from-navy-50 to-navy-100/30 rounded-full text-sm font-medium text-navy-700 border border-navy-200/40 shadow-sm"
                >
                  {track}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Orientation readiness + exploration quests */}
        <div className="mt-10">
          <OrientationReadiness topSchool={topSchool} />
        </div>

        {/* Legal disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3"
        >
          <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-xs text-amber-800 leading-relaxed">{t("results.disclaimer")}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
