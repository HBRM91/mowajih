import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCompareStore } from "../stores/compareStore";
import { TIER_COLORS, ADMISSION_COLORS, type School } from "../data/schools";
import { getSchoolText } from "../data/schools.i18n";

// ─── Reference data (from verified 2025 sources) ─────────────────────────────

type HousingData = { coloc: [number, number]; studio: [number, number] } | "campus_only";

const CITY_HOUSING: Record<string, HousingData> = {
  "Rabat":          { coloc: [1000, 1800], studio: [2000, 3500] },
  "Casablanca":     { coloc: [1200, 2000], studio: [2500, 4000] },
  "Marrakech":      { coloc: [800, 1500],  studio: [1500, 2500] },
  "Fès":            { coloc: [800, 1500],  studio: [1200, 2000] },
  "Tanger":         { coloc: [800, 1500],  studio: [1200, 2000] },
  "Agadir":         { coloc: [700, 1200],  studio: [1000, 1800] },
  "Oujda":          { coloc: [600, 1000],  studio: [1000, 1500] },
  "Kénitra":        { coloc: [700, 1200],  studio: [1000, 1800] },
  "Béni Mellal":    { coloc: [600, 1000],  studio: [900, 1500]  },
  "Ben Guerir":     "campus_only",
  "Ifrane":         "campus_only",
  "Sala Al Jadida": { coloc: [1000, 2000], studio: [1500, 2500] },
  "Mohammadia":     { coloc: [1000, 1800], studio: [1500, 2500] },
  "Settat":         { coloc: [600, 1000],  studio: [800, 1400]  },
  "El Jadida":      { coloc: [700, 1200],  studio: [1000, 1800] },
  "Tétouan":        { coloc: [600, 1200],  studio: [900, 1500]  },
  "Meknès":         { coloc: [700, 1200],  studio: [1000, 1600] },
  "Nador":          { coloc: [500, 1000],  studio: [800, 1500]  },
  "Errachidia":     { coloc: [500, 900],   studio: [800, 1400]  },
  "Al Hoceïma":     { coloc: [500, 900],   studio: [800, 1400]  },
  "Khouribga":      { coloc: [500, 900],   studio: [800, 1300]  },
  "Safi":           { coloc: [500, 900],   studio: [800, 1300]  },
  "Berrechid":      { coloc: [600, 1000],  studio: [800, 1400]  },
};

const TIER_SALARY: Record<string, { start: [number, number]; senior: [number, number] }> = {
  elite:      { start: [10000, 15000], senior: [25000, 60000] },
  premium:    { start: [10000, 15000], senior: [25000, 50000] },
  selective:  { start: [9000,  11000], senior: [18000, 30000] },
  standard:   { start: [6000,  10000], senior: [15000, 25000] },
  accessible: { start: [4000,  6000],  senior: [8000,  15000] },
};

const CITY_TRANSPORT: Record<string, Record<string, string>> = {
  "Rabat":          { fr: "Tramway · Bus (6 MAD) · Pass 150 MAD/mois",       ar: "ترامواي · حافلة (6 دره) · تذكرة شهرية 150 دره",        en: "Tram · Bus (6 MAD) · Monthly pass 150 MAD" },
  "Casablanca":     { fr: "Tramway T1-T4 · Busway (6 MAD) · Pass 150 MAD/mois", ar: "ترامواي · حافلة سريعة (6 دره) · تذكرة شهرية 150 دره", en: "Tram T1-T4 · Busway (6 MAD) · Monthly pass 150 MAD" },
  "Marrakech":      { fr: "Bus · Taxi · Train",                                ar: "حافلة · تاكسي · قطار",                                  en: "Bus · Taxi · Train" },
  "Fès":            { fr: "Bus · Taxi · Train (gare Fès Ville)",               ar: "حافلة · تاكسي · قطار (محطة فاس)",                      en: "Bus · Taxi · Train (Fès station)" },
  "Tanger":         { fr: "Bus · Taxi · Train (gare Tanger Ville)",            ar: "حافلة · تاكسي · قطار (محطة طنجة)",                     en: "Bus · Taxi · Train (Tanger station)" },
  "Agadir":         { fr: "Bus · Taxi",                                        ar: "حافلة · تاكسي",                                         en: "Bus · Taxi" },
  "Oujda":          { fr: "Bus · Taxi",                                        ar: "حافلة · تاكسي",                                         en: "Bus · Taxi" },
  "Kénitra":        { fr: "Train Casa (1h) · Bus · Taxi",                      ar: "قطار للدار البيضاء (ساعة) · حافلة · تاكسي",             en: "Train to Casa (1h) · Bus · Taxi" },
  "Ben Guerir":     { fr: "Navette campus · Train Marrakech (50 min)",         ar: "حافلة الحرم · قطار مراكش (50 دق)",                     en: "Campus shuttle · Train Marrakech (50 min)" },
  "Ifrane":         { fr: "Taxi depuis Fès (60 km) · Bus",                     ar: "تاكسي من فاس (60 كم) · حافلة",                         en: "Taxi from Fès (60 km) · Bus" },
  "Sala Al Jadida": { fr: "Tramway Rabat-Salé · Bus",                          ar: "ترامواي الرباط-سلا · حافلة",                            en: "Rabat-Salé Tram · Bus" },
  "Mohammadia":     { fr: "Train Casablanca (20 min) · Bus",                   ar: "قطار الدار البيضاء (20 دق) · حافلة",                    en: "Train to Casablanca (20 min) · Bus" },
  "Meknès":         { fr: "Bus · Taxi · Train (gare Meknès Ville)",            ar: "حافلة · تاكسي · قطار (محطة مكناس)",                    en: "Bus · Taxi · Train (Meknès station)" },
};

// ─── Section configuration ────────────────────────────────────────────────────

interface CompareSection {
  key: string;
  labelKey: string;
  icon: string;
  rows: { key: string; labelKey: string }[];
}

const COMPARE_SECTIONS: CompareSection[] = [
  {
    key: "admission",
    labelKey: "compare.section.admission",
    icon: "🎯",
    rows: [
      { key: "tier",       labelKey: "compare.row.tier" },
      { key: "access",     labelKey: "compare.row.access" },
      { key: "admission",  labelKey: "compare.row.admission" },
      { key: "minGrade",   labelKey: "compare.row.mingrade" },
      { key: "tracks",     labelKey: "compare.row.tracks" },
      { key: "founded",    labelKey: "compare.row.founded" },
      { key: "enrollment", labelKey: "compare.row.enrollment" },
    ],
  },
  {
    key: "campus",
    labelKey: "compare.section.campus",
    icon: "🏫",
    rows: [
      { key: "campus",          labelKey: "compare.row.campus" },
      { key: "campusSize",      labelKey: "compare.row.campus_size" },
      { key: "housingOnCampus", labelKey: "compare.row.housing_oncampus" },
      { key: "offCampus",       labelKey: "compare.row.offcampus" },
      { key: "transport",       labelKey: "compare.row.transport" },
    ],
  },
  {
    key: "programs",
    labelKey: "compare.section.programs",
    icon: "📚",
    rows: [
      { key: "programs",    labelKey: "compare.row.programs" },
      { key: "jobFamilies", labelKey: "compare.row.job_families" },
    ],
  },
  {
    key: "cost",
    labelKey: "compare.section.cost",
    icon: "💰",
    rows: [
      { key: "annualCost", labelKey: "compare.row.cost" },
    ],
  },
  {
    key: "careers",
    labelKey: "compare.section.careers",
    icon: "📊",
    rows: [
      { key: "startSalary",  labelKey: "compare.row.start_salary" },
      { key: "seniorSalary", labelKey: "compare.row.senior_salary" },
    ],
  },
];

// ─── Cell renderer ────────────────────────────────────────────────────────────

function CellValue({ rowKey, school, lang }: { rowKey: string; school: School; lang: string }) {
  const { t } = useTranslation();
  const tc = TIER_COLORS[school.tier];

  switch (rowKey) {

    case "tier":
      return (
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${tc.bg} ${tc.text} ${tc.border}`}>
          {t(`tier.${school.tier}`)}
        </span>
      );

    case "access": {
      const cls = school.access === "public"
        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
        : school.access === "semi-public"
          ? "text-blue-700 bg-blue-50 border-blue-200"
          : "text-amber-700 bg-amber-50 border-amber-200";
      return (
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${cls}`}>
          {t(`access.${school.access}`)}
        </span>
      );
    }

    case "admission": {
      const ac = ADMISSION_COLORS[school.admission];
      return (
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${ac?.bg ?? "bg-gray-100"} ${ac?.text ?? "text-gray-700"} ${ac?.border ?? "border-gray-200"}`}>
          {t(`admission.${school.admission}.label`)}
        </span>
      );
    }

    case "minGrade":
      return (
        <div className="flex items-baseline justify-center gap-0.5">
          <span className="font-heading font-bold text-navy-800 text-2xl">{school.minGrade}</span>
          <span className="text-navy-400 text-sm">/20</span>
        </div>
      );

    case "tracks":
      return (
        <div className="flex flex-wrap gap-1 justify-center">
          {school.tracks.map((tr) => (
            <span key={tr} className="text-[11px] px-2 py-0.5 bg-navy-100 text-navy-700 rounded-md font-bold">
              {tr}
            </span>
          ))}
        </div>
      );

    case "founded":
      return school.founded
        ? <span className="text-sm font-semibold text-navy-700">{school.founded}</span>
        : <span className="text-navy-300 text-xs">{t("compare.na")}</span>;

    case "enrollment":
      return school.enrollmentCount
        ? (
          <div className="text-center">
            <div className="font-heading font-bold text-navy-800 text-xl">{school.enrollmentCount.toLocaleString()}</div>
          </div>
        )
        : <span className="text-navy-300 text-xs">{t("compare.na")}</span>;

    case "campus":
      return school.hasCampus
        ? <span className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">{t("compare.yes")}</span>
        : <span className="text-sm text-rose-400 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full font-medium">{t("compare.no")}</span>;

    case "campusSize":
      return school.campusDetails?.size
        ? <span className="text-sm font-bold text-navy-700">{school.campusDetails.size}</span>
        : <span className="text-navy-300 text-xs">{t("compare.na")}</span>;

    case "housingOnCampus":
      return school.campusDetails?.housing
        ? <span className="text-sm font-bold text-emerald-600">{t("compare.yes")}</span>
        : <span className="text-sm text-navy-400">{t("compare.no")}</span>;

    case "offCampus": {
      const h = CITY_HOUSING[school.city];
      if (!h) return <span className="text-navy-300 text-xs">{t("compare.na")}</span>;
      if (h === "campus_only") return (
        <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg">
          {t("compare.housing.campus_only")}
        </span>
      );
      return (
        <div className="text-xs text-navy-600 space-y-1.5">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="text-[10px] font-bold uppercase text-navy-400 w-11 text-right flex-shrink-0">{t("compare.coloc")}</span>
            <span className="font-semibold text-navy-700">{h.coloc[0].toLocaleString()}–{h.coloc[1].toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <span className="text-[10px] font-bold uppercase text-navy-400 w-11 text-right flex-shrink-0">{t("compare.studio")}</span>
            <span className="font-semibold text-navy-700">{h.studio[0].toLocaleString()}–{h.studio[1].toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-navy-400 text-center">{t("compare.mad_month")}</div>
        </div>
      );
    }

    case "transport": {
      const tr = CITY_TRANSPORT[school.city];
      if (!tr) return <span className="text-navy-300 text-xs">{t("compare.na")}</span>;
      const text = lang === "ar" ? tr.ar : lang === "en" ? tr.en : tr.fr;
      return (
        <div className="flex flex-wrap gap-1 justify-center">
          {text.split(" · ").map((item, i) => (
            <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
              {item}
            </span>
          ))}
        </div>
      );
    }

    case "programs": {
      const { programs: localPrograms } = getSchoolText(school, (["fr","ar","en"].includes(lang) ? lang : "fr") as "fr"|"ar"|"en");
      return (
        <ul className="space-y-1 text-left">
          {localPrograms.slice(0, 4).map((p) => (
            <li key={p} className="text-[11px] text-navy-600 flex items-start gap-1.5 leading-tight">
              <span className="text-gold-500 mt-0.5 flex-shrink-0 font-bold">›</span>
              {p}
            </li>
          ))}
          {localPrograms.length > 4 && (
            <li className="text-[10px] text-navy-400 pl-3 font-medium">+{localPrograms.length - 4}</li>
          )}
        </ul>
      );
    }

    case "jobFamilies": {
      const jf = school.jobFamilies ?? [];
      if (jf.length === 0) return <span className="text-navy-300 text-xs">{t("compare.na")}</span>;
      return (
        <div className="flex flex-wrap gap-1 justify-center">
          {jf.slice(0, 4).map((j) => (
            <span key={j} className="text-[10px] px-1.5 py-0.5 bg-gold-50 text-gold-800 rounded-md border border-gold-200 font-medium leading-tight">
              {j}
            </span>
          ))}
          {jf.length > 4 && (
            <span className="text-[10px] text-navy-400 font-medium w-full text-center">+{jf.length - 4}</span>
          )}
        </div>
      );
    }

    case "annualCost": {
      const [lo, hi] = school.annualCostMAD;
      if (lo === 0 && hi <= 3000) return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
          🎉 {t("compare.free")}
        </span>
      );
      return (
        <div className="text-center">
          <div className="font-heading font-bold text-navy-800 text-sm">
            {lo.toLocaleString()}–{hi.toLocaleString()}
          </div>
          <div className="text-[10px] text-navy-400 font-medium">{t("compare.mad_year")}</div>
        </div>
      );
    }

    case "startSalary": {
      const sal = TIER_SALARY[school.tier];
      if (!sal) return <span className="text-navy-300 text-xs">{t("compare.na")}</span>;
      return (
        <div className="text-center">
          <div className="font-heading font-bold text-navy-800 text-sm">
            {sal.start[0].toLocaleString()}–{sal.start[1].toLocaleString()}
          </div>
          <div className="text-[10px] text-navy-400">{t("compare.mad_net_month")}</div>
        </div>
      );
    }

    case "seniorSalary": {
      const sal = TIER_SALARY[school.tier];
      if (!sal) return <span className="text-navy-300 text-xs">{t("compare.na")}</span>;
      return (
        <div className="text-center">
          <div className="font-heading font-bold text-gold-600 text-sm">
            {sal.senior[0].toLocaleString()}–{sal.senior[1].toLocaleString()}
          </div>
          <div className="text-[10px] text-navy-400">{t("compare.mad_net_month")}</div>
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Compare() {
  const { t, i18n } = useTranslation();
  const { schools, remove, clear } = useCompareStore();
  const lang = i18n.language;

  return (
    <div className="min-h-screen bg-cream pt-6 pb-20">
      <div className="max-w-6xl mx-auto px-4">

        {/* ── Hero header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 pt-8"
        >
          {/* Logo — large, no box, on light cream background */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src="/logo.png"
              alt="JAD2 TAWJIH"
              className="h-14 md:h-16 w-auto object-contain"
            />
            <div className="text-left">
              <div className="font-heading font-bold text-3xl md:text-4xl text-navy-800 leading-none tracking-tight">JAD2</div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-navy-400 leading-none mt-1.5">TAWJIH</div>
            </div>
          </div>

          <span className="inline-block text-gold-700 text-[11px] font-bold uppercase tracking-[0.18em] mb-4 px-3.5 py-1.5 bg-gold-50 border border-gold-200 rounded-full">
            {t("compare.tool")}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy-800 mt-1 mb-3">
            {t("compare.title")}
          </h1>
          <p className="text-navy-400 max-w-lg mx-auto text-sm leading-relaxed">
            {t("compare.subtitle")}
          </p>
        </motion.div>

        {schools.length === 0 ? (

          /* ── Empty state ────────────────────────────────────────────────── */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center py-24 bg-white rounded-3xl border border-gold-100/80 shadow-sm"
          >
            <div className="text-7xl mb-6 select-none">⚖️</div>
            <h2 className="font-heading text-2xl font-bold text-navy-700 mb-3">{t("compare.empty.title")}</h2>
            <p className="text-navy-400 mb-10 max-w-xs mx-auto text-sm leading-relaxed">{t("compare.empty.desc")}</p>
            <Link
              to="/ecoles"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 rounded-full font-bold text-sm hover:from-navy-800 hover:to-navy-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t("compare.empty.cta")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>

        ) : (

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            {/* ── Toolbar ───────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm text-navy-500">
                <span className="font-heading font-bold text-navy-700">{schools.length}/3</span>
                {schools.length < 3 && (
                  <Link to="/ecoles" className="text-gold-600 font-semibold hover:text-gold-700 transition">
                    {t("compare.add")}
                  </Link>
                )}
              </div>
              <button
                onClick={clear}
                className="text-xs text-rose-400 hover:text-rose-600 font-semibold transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t("compare.clear")}
              </button>
            </div>

            {/* ── Comparison panel ─────────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-gold-100/70 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <div style={{ minWidth: "600px" }}>

                  {/* School header row */}
                  <div
                    className="grid border-b border-white/8"
                    style={{ gridTemplateColumns: "180px 1fr 1fr 1fr" }}
                  >
                    {/* Label header */}
                    <div className="bg-navy-950 px-5 py-5 flex items-end pb-5">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/25 select-none">
                        {lang === "ar" ? "المعيار" : lang === "en" ? "Criteria" : "Critère"}
                      </span>
                    </div>

                    {/* School cards (always 3 slots) */}
                    {[0, 1, 2].map((i) => {
                      const school = schools[i];
                      if (school) {
                        const tc = TIER_COLORS[school.tier];
                        return (
                          <div
                            key={school.slug}
                            className="bg-gradient-to-b from-navy-950 to-navy-900 border-l border-white/6 p-5 text-center"
                          >
                            {/* Tier accent bar */}
                            <div className={`h-1 rounded-full mb-4 mx-auto w-16 ${tc.dot}`} />

                            {/* Icon */}
                            <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl ${tc.bg} border-2 ${tc.border} flex items-center justify-center text-2xl shadow-sm`}>
                              {school.icon}
                            </div>

                            {/* Name + city */}
                            <h3 className="font-heading font-bold text-white text-sm leading-tight mb-0.5">
                              {school.shortName}
                            </h3>
                            <p className="text-white/45 text-[11px] mb-3 flex items-center justify-center gap-1">
                              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {school.city}
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-1 justify-center mb-4">
                              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>
                                {t(`tier.${school.tier}`)}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/65 font-medium">
                                {t(`type.${school.type}`)}
                              </span>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => remove(school.slug)}
                              className="text-[10px] text-rose-400/70 hover:text-rose-300 font-medium transition flex items-center justify-center gap-1 mx-auto"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              {t("compare.remove")}
                            </button>
                          </div>
                        );
                      }

                      // Empty add slot — show only the first empty slot as "add"
                      if (i === schools.length) {
                        return (
                          <div key={i} className="bg-navy-950/70 border-l border-white/6 p-5 flex items-center justify-center">
                            <Link
                              to="/ecoles"
                              className="flex flex-col items-center gap-3 text-white/25 hover:text-white/55 transition group"
                            >
                              <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-white/15 group-hover:border-gold-400/40 flex items-center justify-center text-2xl transition">
                                +
                              </div>
                              <span className="text-[11px] font-medium text-center leading-tight max-w-[80px]">
                                {t("compare.add_slot")}
                              </span>
                            </Link>
                          </div>
                        );
                      }

                      // Extra empty slot (when only 1 school)
                      return (
                        <div key={i} className="bg-navy-950/40 border-l border-white/4" />
                      );
                    })}
                  </div>

                  {/* Comparison sections */}
                  {COMPARE_SECTIONS.map((section) => (
                    <div key={section.key}>

                      {/* Section header — spans full width */}
                      <div className="border-t border-gold-100 border-b border-gold-50 bg-gradient-to-r from-navy-50 to-cream/60 px-5 py-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-navy-500 flex items-center gap-2">
                          <span className="text-base">{section.icon}</span>
                          {t(section.labelKey)}
                        </span>
                      </div>

                      {/* Section rows */}
                      {section.rows.map((row, ri) => (
                        <div
                          key={row.key}
                          className={`grid border-b border-gold-50/60 ${ri % 2 === 1 ? "bg-cream/25" : "bg-white"}`}
                          style={{ gridTemplateColumns: "180px 1fr 1fr 1fr" }}
                        >
                          {/* Row label */}
                          <div className="px-5 py-4 border-r border-gold-50 flex items-start">
                            <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wide leading-snug">
                              {t(row.labelKey)}
                            </span>
                          </div>

                          {/* Values — 3 cells always */}
                          {[0, 1, 2].map((i) => {
                            const school = schools[i];
                            return (
                              <div
                                key={i}
                                className={`px-4 py-4 flex items-center justify-center border-r border-gold-50/50 last:border-r-0 ${!school ? "bg-navy-50/10" : ""}`}
                              >
                                {school ? (
                                  <CellValue rowKey={row.key} school={school} lang={lang} />
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Profile links ─────────────────────────────────────────────── */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {schools.map((school) => {
                const tc = TIER_COLORS[school.tier];
                return (
                  <Link
                    key={school.slug}
                    to={`/ecoles/${school.slug}`}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 border ${tc.border} ${tc.bg} ${tc.text} rounded-xl text-sm font-bold hover:shadow-md transition-all group`}
                  >
                    <span className="text-base">{school.icon}</span>
                    {t("compare.view_sheet")} {school.shortName}
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                );
              })}
              {schools.length < 3 && (
                <Link
                  to="/ecoles"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-dashed border-navy-200 text-navy-500 rounded-xl text-sm font-semibold hover:border-gold-400 hover:text-gold-700 transition-all"
                >
                  + {t("compare.add_slot")}
                </Link>
              )}
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
