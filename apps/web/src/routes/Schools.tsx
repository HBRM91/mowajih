import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  SCHOOLS,
  TIER_COLORS,
  ADMISSION_COLORS,
  TYPE_LABELS,
  type SchoolTier,
  type SchoolType,
} from "../data/schools";
import SchoolLogo from "../components/ui/SchoolLogo";
import { useCompareStore } from "../stores/compareStore";

const TYPE_ICONS: Record<string, string> = {
  engineering: "⚙️",
  business: "💼",
  medicine: "🩺",
  architecture: "🏛️",
  agriculture: "🌾",
  arts: "🎨",
  preparatory: "📐",
  university: "🎓",
  technology: "🖥️",
};

const TRACK_LIST = ["SM", "PC", "SVT", "SE", "SH", "STI", "L"];
const TIER_ORDER: SchoolTier[] = ["elite", "premium", "selective", "standard", "accessible"];

export default function Schools() {
  const { t } = useTranslation();
  const { toggle: compareToggle, has: inCompare, schools: compareSchools } = useCompareStore();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<SchoolType | "all">("all");
  const [filterTier, setFilterTier] = useState<SchoolTier | "all">("all");
  const [filterTrack, setFilterTrack] = useState<string>("all");
  const [filterAccess, setFilterAccess] = useState<"all" | "public" | "private">("all");
  const [sortBy, setSortBy] = useState<"tier" | "alpha" | "cost">("tier");

  const filtered = useMemo(() => {
    let result = SCHOOLS.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.shortName.toLowerCase().includes(q) &&
          !s.city.toLowerCase().includes(q) &&
          !s.programs.some((p) => p.toLowerCase().includes(q))
        ) return false;
      }
      if (filterType !== "all" && s.type !== filterType) return false;
      if (filterTier !== "all" && s.tier !== filterTier) return false;
      if (filterTrack !== "all" && !s.tracks.includes(filterTrack)) return false;
      if (filterAccess === "public" && s.access !== "public" && s.access !== "semi-public") return false;
      if (filterAccess === "private" && s.access !== "private" && s.access !== "semi-public") return false;
      return true;
    });

    if (sortBy === "tier") {
      result = result.sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
    } else if (sortBy === "alpha") {
      result = result.sort((a, b) => a.shortName.localeCompare(b.shortName, "fr"));
    } else if (sortBy === "cost") {
      result = result.sort((a, b) => a.annualCostMAD[0] - b.annualCostMAD[0]);
    }

    return result;
  }, [search, filterType, filterTier, filterTrack, filterAccess, sortBy]);

  const typeGroups = useMemo(() => {
    const counts: Partial<Record<SchoolType | "all", number>> = { all: SCHOOLS.length };
    SCHOOLS.forEach((s) => {
      counts[s.type] = (counts[s.type] ?? 0) + 1;
    });
    return counts;
  }, []);

  const resetFilters = () => {
    setSearch("");
    setFilterType("all");
    setFilterTier("all");
    setFilterTrack("all");
    setFilterAccess("all");
    setSortBy("tier");
  };

  const hasActiveFilter = search || filterType !== "all" || filterTier !== "all" || filterTrack !== "all" || filterAccess !== "all";

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-campus.jpeg')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 to-navy-900/95" />
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-navy-300 hover:text-gold-300 text-sm mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t("schools.back")}
            </Link>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
              {t("schools.title")}
              <br />
              <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
                {t("schools.title.highlight")}
              </span>
            </h1>
            <p className="text-navy-200 text-lg max-w-2xl mb-8">
              {t("schools.subtitle", { count: SCHOOLS.length })}
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("schools.search.placeholder")}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-navy-400 focus:outline-none focus:border-gold-400/60 focus:bg-white/15 transition-all text-sm backdrop-blur-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Type filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filterType === "all"
                ? "bg-navy-800 text-white shadow-lg"
                : "bg-white border border-parchment text-navy-600 hover:border-gold-200"
            }`}
          >
            {t("schools.filter.all")} ({typeGroups.all})
          </button>
          {(Object.keys(TYPE_LABELS) as SchoolType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? "all" : type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                filterType === type
                  ? "bg-navy-800 text-white shadow-lg"
                  : "bg-white border border-parchment text-navy-600 hover:border-gold-200"
              }`}
            >
              <span>{TYPE_ICONS[type]}</span>
              {t(`type.${type}`)}
              {typeGroups[type] ? <span className="opacity-60">({typeGroups[type]})</span> : null}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-parchment p-5 space-y-6 sticky top-20">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-navy-400 mb-3">{t("schools.sidebar.tier")}</div>
                <div className="space-y-1.5">
                  {(["all", ...TIER_ORDER] as const).map((tier) => {
                    const isAll = tier === "all";
                    return (
                      <button
                        key={tier}
                        onClick={() => setFilterTier(tier as SchoolTier | "all")}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          filterTier === tier
                            ? "bg-navy-800 text-white"
                            : "text-navy-600 hover:bg-parchment"
                        }`}
                      >
                        {isAll ? t("schools.filter.tier.all") : t(`tier.${tier}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-navy-400 mb-3">{t("schools.sidebar.track")}</div>
                <div className="flex flex-wrap gap-1.5">
                  {["all", ...TRACK_LIST].map((track) => (
                    <button
                      key={track}
                      onClick={() => setFilterTrack(filterTrack === track ? "all" : track)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        filterTrack === track
                          ? "bg-gold-500 text-navy-900"
                          : "bg-parchment text-navy-500 hover:bg-gold-50"
                      }`}
                    >
                      {track === "all" ? t("schools.filter.all") : track}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-navy-400 mb-3">{t("schools.sidebar.access")}</div>
                <div className="space-y-1.5">
                  {(["all", "public", "private"] as const).map((access) => (
                    <button
                      key={access}
                      onClick={() => setFilterAccess(access)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        filterAccess === access
                          ? "bg-navy-800 text-white"
                          : "text-navy-600 hover:bg-parchment"
                      }`}
                    >
                      {access === "all"
                        ? t("schools.filter.access.all")
                        : access === "public"
                          ? t("schools.filter.access.public")
                          : t("schools.filter.access.private")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-navy-400 mb-3">{t("schools.sidebar.sort")}</div>
                <div className="space-y-1.5">
                  {(["tier", "alpha", "cost"] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSortBy(key)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        sortBy === key
                          ? "bg-navy-800 text-white"
                          : "text-navy-600 hover:bg-parchment"
                      }`}
                    >
                      {t(`schools.sort.${key}`)}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilter && (
                <button
                  onClick={resetFilters}
                  className="w-full py-2 text-xs text-gold-600 hover:text-gold-700 font-semibold border border-gold-200 rounded-xl hover:bg-gold-50 transition-all"
                >
                  {t("schools.reset")}
                </button>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-navy-400">
                <strong className="text-navy-700">{filtered.length}</strong>{" "}
                {t("schools.results.count", { count: filtered.length })}
                {hasActiveFilter && <span className="text-gold-600"> {t("schools.results.filtered")}</span>}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-navy-400"
                >
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-lg font-medium mb-2">{t("schools.empty.title")}</p>
                  <p className="text-sm">{t("schools.empty.subtitle")}</p>
                  <button onClick={resetFilters} className="mt-4 px-6 py-2 bg-gold-500 text-navy-900 rounded-full text-sm font-bold hover:bg-gold-400 transition-colors">
                    {t("schools.empty.btn")}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {filtered.map((school, i) => {
                    const tierColors = TIER_COLORS[school.tier];
                    const admColors = ADMISSION_COLORS[school.admission];
                    const costText =
                      school.annualCostMAD[0] === 0 && school.annualCostMAD[1] <= 3000
                        ? t("match.cost.free")
                        : t("school.cost.range", { min: school.annualCostMAD[0].toLocaleString("fr-FR"), max: school.annualCostMAD[1].toLocaleString("fr-FR") });
                    return (
                      <motion.div
                        key={school.slug}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                        className="relative group/card"
                      >
                        <Link
                          to={`/ecoles/${school.slug}`}
                          className="block bg-white rounded-2xl border border-parchment hover:border-gold-300 hover:shadow-xl hover:shadow-navy-900/6 transition-all duration-300 group overflow-hidden h-full"
                        >
                          {/* Top tier accent */}
                          <div className={`h-1 w-full ${school.tier === "elite" ? "bg-gradient-to-r from-amber-400 to-gold-500" : school.tier === "premium" ? "bg-gradient-to-r from-blue-400 to-blue-600" : school.tier === "selective" ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-gradient-to-r from-slate-300 to-slate-400"}`} />
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <SchoolLogo school={school} />
                                <div>
                                  <div className="font-bold text-navy-800 text-sm leading-tight group-hover:text-gold-700 transition-colors">
                                    {school.shortName}
                                  </div>
                                  <div className="text-xs text-navy-400 flex items-center gap-1 mt-0.5">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {school.city}
                                  </div>
                                </div>
                              </div>
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${tierColors.bg} ${tierColors.text} ${tierColors.border}`}>
                                {t(`tier.${school.tier}`)}
                              </span>
                            </div>

                            <p className="text-navy-500 text-xs leading-relaxed mb-3 line-clamp-2">{school.description}</p>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {school.tracks.slice(0, 4).map((tr) => (
                                <span key={tr} className="text-[10px] px-1.5 py-0.5 bg-navy-50 text-navy-500 rounded border border-navy-100 font-medium">
                                  {tr}
                                </span>
                              ))}
                              {school.tracks.length > 4 && (
                                <span className="text-[10px] px-1.5 py-0.5 text-navy-400">+{school.tracks.length - 4}</span>
                              )}
                            </div>

                            {school.admission === "cnc" && (
                              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-1.5 rounded-lg">
                                {t("cpge.badge")}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-parchment">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${admColors.bg} ${admColors.text} ${admColors.border}`}>
                                {t(`admission.${school.admission}.label`)}
                              </span>
                              <span className={`text-xs font-bold ${costText === t("match.cost.free") ? "text-emerald-600" : "text-navy-500"}`}>
                                {costText}
                              </span>
                            </div>
                          </div>
                        </Link>
                        {/* Compare toggle button */}
                        <button
                          onClick={(e) => { e.preventDefault(); compareToggle(school); }}
                          className={`absolute top-3 right-3 z-10 opacity-0 group-hover/card:opacity-100 transition-all duration-200 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm ${
                            inCompare(school.slug)
                              ? "bg-gold-500 text-navy-900 opacity-100"
                              : compareSchools.length >= 3
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-navy-800 text-white"
                          }`}
                          disabled={!inCompare(school.slug) && compareSchools.length >= 3}
                          title={inCompare(school.slug) ? "Retirer de la comparaison" : "Ajouter à la comparaison"}
                        >
                          {inCompare(school.slug) ? "✓ Comparé" : "⚖ Comparer"}
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {filtered.length > 0 && (
              <div className="mt-10 text-center">
                <p className="text-navy-400 text-sm mb-4">
                  {t("schools.cta.text")}
                </p>
                <Link
                  to="/orientation"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold hover:shadow-lg hover:shadow-gold-500/25 hover:scale-105 transition-all"
                >
                  {t("schools.cta.btn")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
