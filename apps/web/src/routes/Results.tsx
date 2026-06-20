import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormStore } from "../stores/formStore";
import MatchCard from "../components/results/MatchCard";
import AlternativeList from "../components/results/AlternativeList";
import OrientationReadiness from "../components/results/OrientationReadiness";
import { getSchoolBySlug } from "../data/schools";
import { useCompareStore } from "../stores/compareStore";
import { CAREERS_DATA } from "../data/careers";

// ── Confetti celebration ─────────────────────────────────────────────────────
function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  const COLORS = ["#F59E0B", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#EC4899", "#F97316"];
  const particles = Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * 360;
    const rad = (angle * Math.PI) / 180;
    const dist = 30 + (i % 5) * 8;
    return {
      id: i,
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist - 15,
      color: COLORS[i % COLORS.length],
      size: 5 + (i % 4) * 2,
      delay: i * 0.018,
      round: i % 3 !== 0,
    };
  });
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ left: "50%", top: "35%", opacity: 1, scale: 0 }}
          animate={{ left: `calc(50% + ${p.tx}vw)`, top: `calc(35% + ${p.ty}vh)`, opacity: 0, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: p.delay }}
          style={{ position: "fixed", width: p.size, height: p.size, backgroundColor: p.color, borderRadius: p.round ? "50%" : 2 }}
        />
      ))}
    </div>
  );
}

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

type SortKey = "compatibility" | "cost" | "tier" | "salary" | "employment";
type FilterAccess = "all" | "public" | "semi-public" | "private";
type FilterType = "all" | "engineering" | "business" | "medicine" | "other";

const TIER_ORDER: Record<string, number> = {
  elite: 0, premium: 1, selective: 2, standard: 3, accessible: 4,
};

const TYPE_GROUPS: Record<FilterType, string[]> = {
  all: [],
  engineering: ["engineering", "technology", "architecture", "agriculture"],
  business: ["business"],
  medicine: ["medicine", "dental", "nursing"],
  other: ["arts", "preparatory", "university"],
};

export default function Results() {
  const location = useLocation();
  const { t } = useTranslation();
  const state = location.state as LocationState | null;
  const [sort, setSort] = useState<SortKey>("compatibility");
  const [filterAccess, setFilterAccess] = useState<FilterAccess>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const { schools: compareSchools } = useCompareStore();
  const [shared, setShared] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "city">("list");
  const [copied, setCopied] = useState(false);
  const [celebrated, setCelebrated] = useState(false);

  const hasMatches = state?.matches && state.matches.length > 0;
  const topMatch = hasMatches ? state.matches[0] : null;

  // Mark results obtained, encode URL hash for sharing, trigger celebration
  useEffect(() => {
    if (!hasMatches) return;
    localStorage.setItem("jad2-results-obtained", "true");
    try {
      const compact = state!.matches.slice(0, 5).map((m) => ({
        s: m.university_slug, p: Math.round(m.probability * 100), c: m.confidence,
      }));
      window.history.replaceState(null, "", window.location.pathname + "#" + btoa(JSON.stringify(compact)));
    } catch { /* ignore */ }
    setCelebrated(true);
    const id = setTimeout(() => setCelebrated(false), 2200);
    return () => clearTimeout(id);
  // eslint-disable-next-line
  }, []);

  const copyUrl = async () => {
    try { await navigator.clipboard.writeText(window.location.href); }
    catch { /* fallback silent */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openDeadlineReminder = () => {
    const msg = "⏰ Rappels inscriptions Tawjihi 2026\n\n📅 15 juillet — Clôture cursussup.gov.ma (ENSA, ENCG, ENSAM)\n📅 8 août — Concours FMP Médecine\n📅 22 août — TAFEM ENCG\n📅 31 juillet — Dossiers écoles privées (UM6P, UIR, HEM)\n\n💡 JAD2 TAWJIH → tawjih.jad2advisory.com";
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  const shareOnWhatsApp = () => {
    const top3 = (state?.matches ?? []).slice(0, 3);
    const medals = ["🥇", "🥈", "🥉"];
    const lines = top3.map((m, i) => {
      const school = getSchoolBySlug(m.university_slug);
      return `${medals[i]} ${school?.shortName ?? m.university_slug} — ${Math.round(m.probability * 100)}%`;
    }).join("\n");
    const msg = `J'ai utilisé JAD2 TAWJIH pour mon orientation 2026 🎓\n\nMes meilleures correspondances :\n${lines}\n\nDécouvre tes écoles idéales gratuitement →\ntawjih.jad2advisory.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    setShared(true);
  };

  const topSchool = topMatch ? getSchoolBySlug(topMatch.university_slug) : null;
  const topName = topSchool?.shortName ?? topMatch?.university_slug ?? "";

  // Apply filters first, then sort
  const filteredMatches = hasMatches
    ? state!.matches.filter((m) => {
        const school = getSchoolBySlug(m.university_slug);
        if (filterAccess !== "all") {
          if (!school || school.access !== filterAccess) return false;
        }
        if (filterType !== "all") {
          if (!school) return false;
          const allowedTypes = TYPE_GROUPS[filterType];
          if (!allowedTypes.includes(school.type)) return false;
        }
        return true;
      })
    : [];

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sort === "cost") {
      const ca = a.estimated_annual_cost_mad || (getSchoolBySlug(a.university_slug)?.annualCostMAD[0] ?? 0);
      const cb = b.estimated_annual_cost_mad || (getSchoolBySlug(b.university_slug)?.annualCostMAD[0] ?? 0);
      return ca - cb;
    }
    if (sort === "tier") {
      const ta = getSchoolBySlug(a.university_slug)?.tier ?? "standard";
      const tb = getSchoolBySlug(b.university_slug)?.tier ?? "standard";
      return (TIER_ORDER[ta] ?? 3) - (TIER_ORDER[tb] ?? 3);
    }
    if (sort === "salary") {
      const sa = CAREERS_DATA[a.university_slug]?.avgStartSalaryMAD ?? 0;
      const sb = CAREERS_DATA[b.university_slug]?.avgStartSalaryMAD ?? 0;
      return sb - sa;
    }
    if (sort === "employment") {
      const ea = CAREERS_DATA[a.university_slug]?.employmentRate ?? 0;
      const eb = CAREERS_DATA[b.university_slug]?.employmentRate ?? 0;
      return eb - ea;
    }
    return b.probability - a.probability;
  });

  // Group matches by city for "Par ville" view
  const matchesByCity = useMemo(() => {
    const groups: Record<string, typeof sortedMatches> = {};
    sortedMatches.forEach((m) => {
      const city = getSchoolBySlug(m.university_slug)?.city ?? "Autre";
      (groups[city] = groups[city] ?? []).push(m);
    });
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [sortedMatches]);

  const activeFilterCount = (filterAccess !== "all" ? 1 : 0) + (filterType !== "all" ? 1 : 0);
  const isFiltered = activeFilterCount > 0;

  const clearFilters = () => {
    setFilterAccess("all");
    setFilterType("all");
  };

  const SORT_OPTIONS: { key: SortKey; label: string; icon: string }[] = [
    { key: "compatibility", label: t("results.sort.compatibility"), icon: "🎯" },
    { key: "cost", label: t("results.sort.cost"), icon: "💰" },
    { key: "tier", label: t("results.sort.tier"), icon: "🏆" },
    { key: "salary", label: t("results.sort.salary"), icon: "📈" },
    { key: "employment", label: t("results.sort.employment"), icon: "✅" },
  ];

  const ACCESS_FILTERS: { key: FilterAccess; label: string }[] = [
    { key: "all", label: t("results.filter.access.all") },
    { key: "public", label: t("results.filter.access.public") },
    { key: "semi-public", label: t("results.filter.access.semi-public") },
    { key: "private", label: t("results.filter.access.private") },
  ];

  const TYPE_FILTERS: { key: FilterType; label: string }[] = [
    { key: "all", label: t("results.filter.type.all") },
    { key: "engineering", label: t("results.filter.type.engineering") },
    { key: "business", label: t("results.filter.type.business") },
    { key: "medicine", label: t("results.filter.type.medicine") },
    { key: "other", label: t("results.filter.type.other") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cream"
    >
      <ConfettiBurst active={celebrated} />

      {/* ─── Compact hero ─── */}
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
                  {state!.matches.length > 1
                    ? t("results.count_plural", { count: state!.matches.length })
                    : t("results.count", { count: state!.matches.length })}
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

        {/* WhatsApp share */}
        {hasMatches && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <button
              type="button"
              onClick={shareOnWhatsApp}
              className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                shared
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg shadow-green-500/20"
              }`}
            >
              {shared ? (
                <>✓ Partagé ! Envoie le lien à tes amis</>
              ) : (
                <>
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Partager mes résultats sur WhatsApp
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* ─── Share + Deadline reminder ─── */}
        {hasMatches && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mb-6 grid grid-cols-2 gap-2"
          >
            <button
              type="button"
              onClick={copyUrl}
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm border transition-all ${
                copied ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-white border-gold-200 text-navy-700 hover:border-gold-400"
              }`}
            >
              {copied ? (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Copié !</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copier le lien</>
              )}
            </button>
            <button
              type="button"
              onClick={openDeadlineReminder}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors"
            >
              <span>⏰</span> Rappel dates
            </button>
          </motion.div>
        )}

        {/* ─── Matches section ─── */}
        {hasMatches ? (
          <>
            {/* Sort + Filter bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-5 space-y-2"
            >
              {/* Row 1: Sort pills + Filter toggle */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-navy-400 font-medium flex-shrink-0">{t("results.sort.label")} :</span>
                <div className="flex gap-1.5 flex-wrap flex-1">
                  {SORT_OPTIONS.map(({ key, label, icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSort(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                        sort === key
                          ? "bg-navy-800 text-gold-200 shadow-sm"
                          : "bg-white border border-gold-100 text-navy-500 hover:border-gold-300"
                      }`}
                    >
                      <span className="text-[10px]">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Filters toggle button */}
                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    activeFilterCount > 0
                      ? "bg-gold-500 text-navy-900 border-gold-400"
                      : showFilters
                        ? "bg-navy-100 text-navy-700 border-navy-200"
                        : "bg-white border-gold-100 text-navy-500 hover:border-gold-300"
                  }`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                  </svg>
                  {t("results.filter.label")}
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 bg-navy-900 text-gold-300 rounded-full text-[9px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Row 2: Filter panels (collapsible) */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-1 pb-2 space-y-2.5 bg-white border border-gold-100 rounded-xl p-3">
                      {/* Access filter */}
                      <div>
                        <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block mb-1.5">
                          {t("results.filter.access.label")}
                        </span>
                        <div className="flex gap-1.5 flex-wrap">
                          {ACCESS_FILTERS.map(({ key, label }) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setFilterAccess(key)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                                filterAccess === key
                                  ? "bg-navy-800 text-gold-200 border-navy-700"
                                  : "bg-white border-gray-200 text-navy-500 hover:border-gold-300"
                              }`}
                            >
                              {key === "public" && "🏛️ "}
                              {key === "semi-public" && "🏢 "}
                              {key === "private" && "🎓 "}
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Type filter */}
                      <div>
                        <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block mb-1.5">
                          {t("results.filter.type.label")}
                        </span>
                        <div className="flex gap-1.5 flex-wrap">
                          {TYPE_FILTERS.map(({ key, label }) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setFilterType(key)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                                filterType === key
                                  ? "bg-navy-800 text-gold-200 border-navy-700"
                                  : "bg-white border-gray-200 text-navy-500 hover:border-gold-300"
                              }`}
                            >
                              {key === "engineering" && "⚙️ "}
                              {key === "business" && "📊 "}
                              {key === "medicine" && "🩺 "}
                              {key === "other" && "🎨 "}
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clear filters */}
                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {t("results.filter.clear")}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result count when filtered */}
              {isFiltered && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-navy-500">
                    {t("results.showing", { shown: sortedMatches.length, total: state!.matches.length })}
                  </span>
                  {sortedMatches.length === 0 && (
                    <button type="button" onClick={clearFilters} className="text-xs font-bold text-gold-700 hover:underline">
                      {t("results.filter.clear")} →
                    </button>
                  )}
                </div>
              )}

              {/* Compare CTA */}
              {compareSchools.length > 0 && (
                <Link
                  to="/comparer"
                  className="flex items-center gap-3 px-4 py-2.5 bg-gold-50 border border-gold-300 rounded-xl hover:bg-gold-100 transition-colors"
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

              {/* View mode toggle */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-navy-400 font-medium">Vue :</span>
                {(["list", "city"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      viewMode === mode ? "bg-navy-800 text-gold-200 border-navy-700" : "bg-white border-gold-100 text-navy-500 hover:border-gold-300"
                    }`}
                  >
                    {mode === "list" ? "📋 Liste" : "📍 Par ville"}
                  </button>
                ))}
              </div>

              {compareSchools.length === 0 && (
                <p className="text-[11px] text-navy-400 flex items-center gap-1.5">
                  <span>⚖</span>
                  <span>{t("results.compare.banner")} — {t("compare.add")} depuis chaque carte</span>
                </p>
              )}
            </motion.div>

            {/* Cards — list or city view */}
            {sortedMatches.length === 0 ? (
              <div className="text-center py-12 text-navy-400">
                <div className="text-4xl mb-3">🔍</div>
                <div className="font-semibold text-navy-600 mb-1">Aucune école pour ces filtres</div>
                <button type="button" onClick={clearFilters} className="text-sm font-bold text-gold-700 hover:underline">Effacer les filtres →</button>
              </div>
            ) : viewMode === "city" ? (
              <div className="space-y-6">
                {matchesByCity.map(([city, cityMatches]) => (
                  <div key={city}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">📍</span>
                      <h3 className="font-heading font-bold text-navy-800 text-sm">{city}</h3>
                      <span className="text-[10px] bg-navy-100 text-navy-600 font-bold px-2 py-0.5 rounded-full">{cityMatches.length} école{cityMatches.length > 1 ? "s" : ""}</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                      {cityMatches.map((match, idx) => (
                        <motion.div key={match.university_slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="h-full">
                          <MatchCard match={match} rank={sortedMatches.indexOf(match)} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                <AnimatePresence mode="popLayout">
                  {sortedMatches.map((match, idx) => (
                    <motion.div
                      key={match.university_slug}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25, layout: { duration: 0.35, ease: "easeInOut" } }}
                      className="h-full"
                    >
                      <MatchCard match={match} rank={idx} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
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

        {/* ─── Action checklist ─── */}
        {hasMatches && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-white rounded-2xl border border-gold-100 shadow-sm overflow-hidden"
          >
            <div className="bg-gradient-to-r from-navy-800 to-navy-900 px-5 py-4 flex items-center gap-3">
              <span className="text-xl">📋</span>
              <div>
                <div className="font-heading font-bold text-white text-base">Ton plan d'action 2026</div>
                <div className="text-navy-300 text-xs">Les étapes clés pour candidater à tes meilleures correspondances</div>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {(() => {
                const matchedSchools = state!.matches.slice(0, 5).map((m) => getSchoolBySlug(m.university_slug)).filter(Boolean);
                const hasCNC = matchedSchools.some((s) => s?.admission === "cnc");
                const hasTAFEM = matchedSchools.some((s) => s?.admission === "tafem");
                const hasConcours = matchedSchools.some((s) => s?.admission === "concours" && s.type !== "medicine");
                const hasMedicine = matchedSchools.some((s) => s?.type === "medicine" || s?.type === "dental");
                const hasPrivate = matchedSchools.some((s) => s?.access === "private");
                const hasDossier = matchedSchools.some((s) => s?.admission === "dossier");

                const steps = [
                  hasCNC && {
                    icon: "📐",
                    color: "bg-violet-50 border-violet-200 text-violet-800",
                    title: "Intégrer une CPGE",
                    desc: "Inscris-toi en classes préparatoires (MP/PSI/TSI) — c'est le seul accès aux grandes écoles CNC.",
                    link: "https://cpge.ac.ma", linkLabel: "cpge.ac.ma",
                    deadline: "Avant le 15 juillet 2026",
                  },
                  (hasConcours || hasTAFEM) && {
                    icon: "🖥️",
                    color: "bg-blue-50 border-blue-200 text-blue-800",
                    title: "Inscription cursussup.gov.ma",
                    desc: "ENSA, ENCG, ENSAM — toutes les inscriptions passent par la plateforme nationale Tawjihi.",
                    link: "https://cursussup.gov.ma", linkLabel: "cursussup.gov.ma",
                    deadline: "Avant le 15 juillet 2026",
                  },
                  hasTAFEM && {
                    icon: "📝",
                    color: "bg-sky-50 border-sky-200 text-sky-800",
                    title: "Préparer le concours TAFEM (ENCG)",
                    desc: "Épreuve QCM écrite après présélection sur note Bac. Entraîne-toi sur les annales TAFEM.",
                    link: "https://tafem.ma", linkLabel: "tafem.ma",
                    deadline: "Courant août 2026",
                  },
                  hasMedicine && {
                    icon: "🩺",
                    color: "bg-rose-50 border-rose-200 text-rose-800",
                    title: "Préparer le concours FMP médecine",
                    desc: "Épreuve nationale SVT + Physique-Chimie + Mathématiques. Très sélectif — commence la révision maintenant.",
                    deadline: "Concours courant août 2026",
                  },
                  (hasDossier || hasPrivate) && {
                    icon: "📁",
                    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
                    title: "Préparer ton dossier de candidature",
                    desc: "Photos d'identité, relevés de notes, copie CNIE, lettre de motivation. Contacte directement les écoles privées.",
                    deadline: "Avant fin juillet 2026",
                  },
                  {
                    icon: "⚖️",
                    color: "bg-gold-50 border-gold-200 text-gold-800",
                    title: "Comparer et finaliser ton choix",
                    desc: "Utilise le comparateur JAD2 TAWJIH pour mettre côte à côte tes meilleures options avant de décider.",
                    link: "/comparer", linkLabel: "Ouvrir le comparateur", internal: true,
                  },
                ].filter(Boolean) as Array<{icon:string;color:string;title:string;desc:string;link?:string;linkLabel?:string;internal?:boolean;deadline?:string}>;

                return steps.map((step, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${step.color}`}>
                    <span className="text-lg flex-shrink-0 mt-0.5">{step.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{step.title}</div>
                      <div className="text-xs leading-relaxed mt-0.5 opacity-80">{step.desc}</div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {step.deadline && (
                          <span className="text-[10px] font-bold opacity-70">⏰ {step.deadline}</span>
                        )}
                        {step.link && step.linkLabel && (
                          step.internal
                            ? <a href={step.link} className="text-[10px] font-bold underline">{step.linkLabel} →</a>
                            : <a href={step.link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold underline">{step.linkLabel} →</a>
                        )}
                      </div>
                    </div>
                    <span className="text-lg opacity-30 flex-shrink-0">○</span>
                  </div>
                ));
              })()}
            </div>
          </motion.div>
        )}

        {/* Print button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex justify-center"
        >
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 border border-navy-200 text-navy-500 rounded-full text-xs font-semibold hover:bg-navy-50 transition-colors print:hidden"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimer / Sauvegarder en PDF
          </button>
        </motion.div>

        {/* Legal disclaimer */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 print:hidden">
          <span className="text-amber-500 flex-shrink-0 mt-0.5 text-sm">⚠️</span>
          <p className="text-xs text-amber-800 leading-relaxed">{t("results.disclaimer")}</p>
        </div>
      </div>
    </motion.div>
  );
}
