import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MOROCCAN_CITIES_BY_REGION } from "../../data/schools";

const REGION_DISPLAY: Record<string, string> = {
  "Tanger-Tétouan-Al Hoceïma":  "Tanger-Tétouan",
  "Oriental":                    "Oriental",
  "Fès-Meknès":                  "Fès-Meknès",
  "Rabat-Salé-Kénitra":          "Rabat-Salé",
  "Béni Mellal-Khénifra":        "Béni Mellal",
  "Casablanca-Settat":           "Casablanca",
  "Marrakech-Safi":              "Marrakech-Safi",
  "Drâa-Tafilalet":              "Drâa-Tafilalet",
  "Souss-Massa":                 "Souss-Massa",
  "Guelmim-Oued Noun":           "Guelmim",
  "Laâyoune-Sakia El Hamra":     "Laâyoune",
  "Dakhla-Oued Ed-Dahab":        "Dakhla",
};

const BUDGET_OPTIONS = [
  { key: "<<3000",    icon: "💚", label: "Moins de 3 000 MAD",  sublabel: "Écoles publiques uniquement" },
  { key: "3000-8000", icon: "💛", label: "3 000 – 8 000 MAD",   sublabel: "Semi-public + privé accessible" },
  { key: "8000-15000",icon: "🧡", label: "8 000 – 15 000 MAD",  sublabel: "Privé mid-range" },
  { key: ">15000",    icon: "💎", label: "Plus de 15 000 MAD",  sublabel: "Privé premium & international" },
] as const;

interface Props {
  onSubmit: () => void;
  isLoading: boolean;
}

export default function StepProfile({ onSubmit, isLoading }: Props) {
  const { t } = useTranslation();
  const { city, region, financialBracket, consent, setField, prevStep } = useFormStore();
  const [selectedRegion, setSelectedRegion] = useState<string>(region || "");
  const [agreed, setAgreed] = useState(consent);

  const regions = Object.keys(MOROCCAN_CITIES_BY_REGION);
  const citiesInRegion = selectedRegion ? MOROCCAN_CITIES_BY_REGION[selectedRegion] : [];
  const isValid = !!city && !!financialBracket && agreed;

  const handleRegionSelect = (r: string) => {
    setSelectedRegion(r);
    setField("region", r);
    setField("city", "");
  };

  const handleConsent = (checked: boolean) => {
    setAgreed(checked);
    setField("consent", checked);
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-heading text-2xl font-bold text-navy-800">{t("step.profile")}</h2>
        <p className="text-navy-400 text-sm mt-1">Ta ville et ton budget nous aident à filtrer les meilleures options pour toi.</p>
      </div>

      <div className="space-y-4">

        {/* Region — compact grid */}
        <div>
          <label className="block text-sm font-bold text-navy-700 mb-2">🗺️ Ta région</label>
          <div className="grid grid-cols-3 gap-1.5">
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRegionSelect(r)}
                className={`py-2 px-2 rounded-xl text-[11px] font-semibold text-center transition-all border leading-tight ${
                  selectedRegion === r
                    ? "bg-navy-800 text-gold-200 border-navy-700 shadow-sm"
                    : "bg-gray-50 border-gray-200 text-navy-600 hover:border-gold-300 hover:bg-gold-50"
                }`}
              >
                {REGION_DISPLAY[r] ?? r}
              </button>
            ))}
          </div>
        </div>

        {/* City pills — appear after region selection */}
        <AnimatePresence>
          {selectedRegion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <label className="block text-sm font-bold text-navy-700 mb-2">📍 Ta ville *</label>
              <div className="flex flex-wrap gap-2">
                {citiesInRegion.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setField("city", c)}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all border ${
                      city === c
                        ? "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 border-gold-400 shadow-sm"
                        : "bg-white border-gray-200 text-navy-600 hover:border-gold-300"
                    }`}
                  >
                    {city === c && "✓ "}{c}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedRegion && (
          <div className="text-center text-xs text-gray-400 py-2">
            👆 Sélectionne d'abord ta région
          </div>
        )}

        {/* Budget — 2×2 grid */}
        <div>
          <label className="block text-sm font-bold text-navy-700 mb-2">💰 Budget mensuel *</label>
          <div className="grid grid-cols-2 gap-2">
            {BUDGET_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setField("financialBracket", opt.key)}
                className={`flex items-start gap-2.5 p-3.5 rounded-xl border-2 text-left transition-all ${
                  financialBracket === opt.key
                    ? "border-gold-400 bg-gold-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{opt.icon}</span>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-navy-800 leading-tight">{opt.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{opt.sublabel}</div>
                </div>
                {financialBracket === opt.key && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-2.5 h-2.5 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Inline consent */}
        <label className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:border-gray-300 transition">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => handleConsent(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:bg-navy-800 peer-checked:border-navy-800 transition flex items-center justify-center">
              <svg className="w-3 h-3 text-gold-300 opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <span className="text-xs text-gray-600 leading-relaxed">
            J'accepte que mes données soient traitées de façon <strong>anonyme et temporaire</strong> pour générer mes résultats. Aucune donnée personnelle conservée.
          </span>
        </label>
      </div>

      {/* Button layout — full-width CTA, then text back link */}
      <div className="mt-6 space-y-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          disabled={!isValid || isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 hover:scale-[1.01]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyse en cours...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              🔍 Voir mes résultats personnalisés
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </motion.button>

        <button
          type="button"
          onClick={prevStep}
          className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition py-1"
        >
          ← Retour à l'étape précédente
        </button>
      </div>
    </div>
  );
}
