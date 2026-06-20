import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MOROCCAN_CITIES_BY_REGION } from "../../data/schools";

const REGION_DISPLAY: Record<string, { fr: string; ar: string; en: string }> = {
  "Tanger-Tétouan-Al Hoceïma": { fr: "Tanger-Tétouan-Al Hoceïma", ar: "طنجة-تطوان-الحسيمة", en: "Tangier-Tetouan-Al Hoceima" },
  "Oriental": { fr: "Oriental", ar: "الجهة الشرقية", en: "Oriental" },
  "Fès-Meknès": { fr: "Fès-Meknès", ar: "فاس-مكناس", en: "Fès-Meknès" },
  "Rabat-Salé-Kénitra": { fr: "Rabat-Salé-Kénitra", ar: "الرباط-سلا-القنيطرة", en: "Rabat-Salé-Kénitra" },
  "Béni Mellal-Khénifra": { fr: "Béni Mellal-Khénifra", ar: "بني ملال-خنيفرة", en: "Béni Mellal-Khénifra" },
  "Casablanca-Settat": { fr: "Casablanca-Settat", ar: "الدار البيضاء-سطات", en: "Casablanca-Settat" },
  "Marrakech-Safi": { fr: "Marrakech-Safi", ar: "مراكش-آسفي", en: "Marrakech-Safi" },
  "Drâa-Tafilalet": { fr: "Drâa-Tafilalet", ar: "درعة-تافيلالت", en: "Drâa-Tafilalet" },
  "Souss-Massa": { fr: "Souss-Massa", ar: "سوس-ماسة", en: "Souss-Massa" },
  "Guelmim-Oued Noun": { fr: "Guelmim-Oued Noun", ar: "كلميم-واد نون", en: "Guelmim-Oued Noun" },
  "Laâyoune-Sakia El Hamra": { fr: "Laâyoune-Sakia El Hamra", ar: "العيون-الساقية الحمراء", en: "Laâyoune-Sakia El Hamra" },
  "Dakhla-Oued Ed-Dahab": { fr: "Dakhla-Oued Ed-Dahab", ar: "الداخلة-وادي الذهب", en: "Dakhla-Oued Ed-Dahab" },
};

const FINANCIAL_ICONS: Record<string, string> = {
  "<<3000": "💚",
  "3000-8000": "💛",
  "8000-15000": "🧡",
  ">15000": "💎",
};

interface Props {
  onSubmit: () => void;
  isLoading: boolean;
}

export default function StepProfile({ onSubmit, isLoading }: Props) {
  const { t, i18n } = useTranslation();
  const { city, region, financialBracket, consent, setField, prevStep } = useFormStore();
  const [selectedRegion, setSelectedRegion] = useState<string>(region || "");
  const [agreed, setAgreed] = useState(consent);

  const lang = i18n.language.startsWith("ar") ? "ar" : i18n.language.startsWith("en") ? "en" : "fr";
  const regions = Object.keys(MOROCCAN_CITIES_BY_REGION);
  const citiesInRegion = selectedRegion ? MOROCCAN_CITIES_BY_REGION[selectedRegion] : [];

  const isValid = city && financialBracket && agreed;

  const handleRegionSelect = (r: string) => {
    setSelectedRegion(r);
    setField("region", r);
    setField("city", "");
  };

  const handleCitySelect = (c: string) => {
    setField("city", c);
  };

  const handleConsent = (checked: boolean) => {
    setAgreed(checked);
    setField("consent", checked);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <span className="inline-flex items-center gap-1.5 text-gold-600 text-sm font-bold uppercase tracking-widest">
          <span className="w-2 h-2 bg-gold-500 rounded-full" />
          {t("step.progress", { current: 3 })}
        </span>
        <h2 className="font-heading text-3xl font-bold text-navy-800 mt-2">{t("step.profile")}</h2>
        <p className="text-navy-400 mt-1.5 text-sm">{t("region.label")} · {t("city.label")} · {t("financial.label")}</p>
      </motion.div>

      <div className="space-y-4">

        {/* Region selector */}
        <div className="bg-white p-5 rounded-2xl border border-gold-100/60 shadow-sm">
          <label className="block text-sm font-bold text-navy-700 mb-3">🗺️ {t("region.label")}</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {regions.map((r) => (
              <motion.button
                key={r}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRegionSelect(r)}
                className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedRegion === r
                    ? "bg-navy-800 text-gold-200 border-navy-700 shadow-md"
                    : "bg-cream border-parchment text-navy-600 hover:border-gold-200 hover:bg-gold-50/50"
                }`}
              >
                {REGION_DISPLAY[r]?.[lang] ?? r}
              </motion.button>
            ))}
          </div>
        </div>

        {/* City selector */}
        <AnimatePresence>
          {selectedRegion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-5 rounded-2xl border border-gold-100/60 shadow-sm overflow-hidden"
            >
              <label className="block text-sm font-bold text-navy-700 mb-3">📍 {t("city.label")} *</label>
              <div className="flex flex-wrap gap-2">
                {citiesInRegion.map((c) => (
                  <motion.button
                    key={c}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCitySelect(c)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                      city === c
                        ? "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 border-gold-400 shadow-md"
                        : "bg-cream border-parchment text-navy-600 hover:border-gold-300 hover:bg-gold-50"
                    }`}
                  >
                    {city === c && "✓ "}{c}
                  </motion.button>
                ))}
              </div>
              {city && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {t("step.profile.city_selected", { city })}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedRegion && (
          <div className="bg-white/60 p-4 rounded-2xl border border-dashed border-gold-200 text-center text-xs text-navy-400">
            👆 {t("step.profile.region_hint")}
          </div>
        )}

        {/* Financial bracket */}
        <div className="bg-white p-5 rounded-2xl border border-gold-100/60 shadow-sm">
          <label className="block text-sm font-bold text-navy-700 mb-3">
            💰 {t("financial.label")} *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(["<<3000", "3000-8000", "8000-15000", ">15000"] as const).map((key) => (
              <motion.button
                key={key}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setField("financialBracket", key)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all touch-target ${
                  financialBracket === key
                    ? "border-gold-400 bg-gradient-to-br from-gold-50 to-gold-100/40 shadow-md"
                    : "border-parchment hover:border-gold-200 bg-cream"
                }`}
              >
                <span className="text-xl flex-shrink-0">{FINANCIAL_ICONS[key]}</span>
                <div>
                  <div className="font-bold text-sm text-navy-700 leading-tight">{t(`financial.${key}`)}</div>
                  <div className="text-[11px] text-navy-400 mt-0.5">{t(`financial.${key}.desc`)}</div>
                </div>
                {financialBracket === key && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Inline consent — replaces the separate step 4 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-navy-50 rounded-2xl border border-navy-100 p-4"
        >
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => handleConsent(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded border-2 border-navy-300 peer-checked:bg-navy-800 peer-checked:border-navy-800 transition flex items-center justify-center group-hover:border-gold-400">
                <svg className="w-3 h-3 text-gold-300 opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <span className="text-xs text-navy-600 leading-relaxed font-medium">
                {t("consent.checkbox")}
              </span>
              <span className="block text-[10px] text-navy-400 mt-1 leading-relaxed">
                🛡️ {t("consent.retention")} · {t("consent.transient")} · Conforme CNDP
              </span>
            </div>
          </label>
        </motion.div>

      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="flex-none w-16 py-3.5 rounded-xl border-2 border-parchment text-navy-600 font-semibold hover:border-gold-200 hover:bg-gold-50/50 touch-target transition text-sm"
        >
          ←
        </button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          disabled={!isValid || isLoading}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold disabled:opacity-40 disabled:cursor-not-allowed touch-target transition shadow-lg shadow-gold-500/20 text-sm"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyse en cours...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              🔍 Voir mes résultats
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
