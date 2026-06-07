import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";
import { useGameStore } from "../../stores/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MOROCCAN_CITIES_BY_REGION } from "../../data/schools";

const financialBrackets = [
  { key: "<<3000", label: "Moins de 3 000 MAD/mois", icon: "💚", desc: "Universités publiques & OFPPT gratuits" },
  { key: "3000-8000", label: "3 000 – 8 000 MAD/mois", icon: "💛", desc: "ENCG, ENSA, EMSI accessibles" },
  { key: "8000-15000", label: "8 000 – 15 000 MAD/mois", icon: "🧡", desc: "UIR, Mundiapolis, HEM possibles" },
  { key: ">15000", label: "Plus de 15 000 MAD/mois", icon: "💎", desc: "UM6P, Al Akhawayn, toutes options" },
];

export default function StepProfile() {
  const { t } = useTranslation();
  const { city, region, financialBracket, setField, nextStep, prevStep } = useFormStore();
  const addXp = useGameStore((s) => s.addXp);
  const [selectedRegion, setSelectedRegion] = useState<string>(region || "");

  const regions = Object.keys(MOROCCAN_CITIES_BY_REGION);
  const citiesInRegion = selectedRegion ? MOROCCAN_CITIES_BY_REGION[selectedRegion] : [];

  const isValid = city && financialBracket;

  const handleNext = () => {
    addXp(15, "Completed profile");
    nextStep();
  };

  const handleRegionSelect = (r: string) => {
    setSelectedRegion(r);
    setField("region", r);
    setField("city", "");
  };

  const handleCitySelect = (c: string) => {
    setField("city", c);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="inline-flex items-center gap-1.5 text-gold-600 text-sm font-bold uppercase tracking-widest">
          <span className="w-2 h-2 bg-gold-500 rounded-full" />
          Étape 3 / 4
        </span>
        <h2 className="font-heading text-3xl font-bold text-navy-800 mt-2">{t("step.profile")}</h2>
        <p className="text-navy-400 mt-2 text-sm">Ta région, ta ville et le budget de ta famille.</p>
      </motion.div>

      <div className="space-y-5">

        {/* Region selector */}
        <div className="bg-white p-5 rounded-2xl border border-gold-100/60 shadow-sm">
          <label className="block text-sm font-bold text-navy-700 mb-3">
            🗺️ Ta région
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {regions.map((r) => (
              <motion.button
                key={r}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRegionSelect(r)}
                className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedRegion === r
                    ? "bg-navy-800 text-gold-200 border-navy-700 shadow-md"
                    : "bg-cream border-parchment text-navy-600 hover:border-gold-200 hover:bg-gold-50/50"
                }`}
              >
                {r}
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
              <label className="block text-sm font-bold text-navy-700 mb-3">
                📍 Ta ville *
              </label>
              <div className="flex flex-wrap gap-2">
                {citiesInRegion.map((c) => (
                  <motion.button
                    key={c}
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center gap-2 text-xs text-emerald-600 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Ville sélectionnée : {city}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedRegion && (
          <div className="bg-white/60 p-4 rounded-2xl border border-dashed border-gold-200 text-center text-xs text-navy-400">
            👆 Sélectionne d'abord ta région pour choisir ta ville
          </div>
        )}

        {/* Financial bracket */}
        <div className="bg-white p-5 rounded-2xl border border-gold-100/60 shadow-sm">
          <label className="block text-sm font-bold text-navy-700 mb-3">
            💰 Budget familial mensuel *
            <span className="text-[11px] text-navy-400 font-normal ml-2">(aide à filtrer les écoles accessibles)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {financialBrackets.map((fb) => (
              <motion.button
                key={fb.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setField("financialBracket", fb.key)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all touch-target ${
                  financialBracket === fb.key
                    ? "border-gold-400 bg-gradient-to-br from-gold-50 to-gold-100/40 shadow-md"
                    : "border-parchment hover:border-gold-200 bg-cream"
                }`}
              >
                <span className="text-xl flex-shrink-0">{fb.icon}</span>
                <div>
                  <div className="font-bold text-sm text-navy-700 leading-tight">{fb.label}</div>
                  <div className="text-[11px] text-navy-400 mt-0.5">{fb.desc}</div>
                </div>
                {financialBracket === fb.key && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-3 h-3 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* XP hint */}
        <div className="flex items-center gap-2 text-xs text-gold-600 bg-gold-50 border border-gold-200 rounded-xl px-4 py-2.5">
          <span className="text-base">🎯</span>
          <span>Cette étape te rapporte <strong>+15 XP</strong> — plus que la moitié du chemin !</span>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={prevStep}
          className="flex-1 py-3.5 rounded-xl border-2 border-parchment text-navy-600 font-semibold hover:border-gold-200 hover:bg-gold-50/50 touch-target transition"
        >
          ← Retour
        </button>
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold hover:from-navy-800 hover:to-navy-900 disabled:opacity-40 disabled:cursor-not-allowed touch-target transition shadow-lg shadow-navy-900/10"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
