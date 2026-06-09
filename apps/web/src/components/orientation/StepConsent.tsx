import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";
import { useGameStore } from "../../stores/gameStore";
import { motion, AnimatePresence } from "framer-motion";

export default function StepConsent({ onSubmit, isLoading }: { onSubmit: (token?: string) => void; isLoading: boolean }) {
  const { t } = useTranslation();
  const { consent, firstName, lastName, emailContact, setField, prevStep } = useFormStore();
  const addXp = useGameStore((s) => s.addXp);
  const awardBadge = useGameStore((s) => s.awardBadge);
  const [agreed, setAgreed] = useState(consent);
  const [showContact, setShowContact] = useState(!!(firstName || lastName || emailContact));

  const handleSubmit = () => {
    addXp(20, "Completed orientation form");
    awardBadge("explorer");
    onSubmit();
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <span className="text-gold-600 text-sm font-semibold uppercase tracking-wider">
          {t("step.progress", { current: 4 })}
        </span>
        <h2 className="font-heading text-3xl font-bold text-navy-800 mt-2">{t("step.consent")}</h2>
        <p className="text-navy-400 mt-2 text-sm">Dernière étape avant de découvrir tes opportunités.</p>
      </motion.div>

      {/* Optional: Generate personalized dossier */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-5 bg-gradient-to-br from-gold-50 to-gold-100/30 border border-gold-200 rounded-2xl p-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
            📋
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="font-heading font-bold text-navy-800 text-sm">Dossier personnalisé (optionnel)</h4>
                <p className="text-xs text-navy-500 mt-0.5">
                  Renseigne ton nom et email pour recevoir un dossier de candidature prêt à soumettre.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowContact((v) => !v)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  showContact
                    ? "bg-navy-800 text-gold-200"
                    : "bg-gold-500 text-navy-900 hover:bg-gold-400"
                }`}
              >
                {showContact ? "Masquer" : "Activer"}
              </button>
            </div>

            <AnimatePresence>
              {showContact && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-navy-500 uppercase tracking-wider mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setField("firstName", e.target.value)}
                        placeholder="Yassine"
                        maxLength={60}
                        className="w-full px-3 py-2 rounded-xl border border-gold-200 bg-white text-sm text-navy-700 focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-navy-500 uppercase tracking-wider mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setField("lastName", e.target.value)}
                        placeholder="Alaoui"
                        maxLength={60}
                        className="w-full px-3 py-2 rounded-xl border border-gold-200 bg-white text-sm text-navy-700 focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-[11px] font-semibold text-navy-500 uppercase tracking-wider mb-1">
                      Email (pour recevoir le dossier)
                    </label>
                    <input
                      type="email"
                      value={emailContact}
                      onChange={(e) => setField("emailContact", e.target.value)}
                      placeholder="yassine@example.com"
                      maxLength={120}
                      className="w-full px-3 py-2 rounded-xl border border-gold-200 bg-white text-sm text-navy-700 focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none"
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-navy-400">
                    Ces informations sont stockées localement et ne sont utilisées que pour générer ton dossier de candidature.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Privacy / CNDP consent block */}
      <div className="bg-gradient-to-br from-navy-50 to-navy-100/30 p-6 rounded-2xl border border-navy-200/30 mb-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-navy-800 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="font-heading font-bold text-navy-800 mb-1">{t("consent.title")}</h3>
            <p className="text-sm text-navy-500 leading-relaxed">{t("consent.text")}</p>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl p-4 text-xs text-navy-400 space-y-2">
          {[t("consent.retention"), t("consent.logged"), t("consent.delete")].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-start gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <span className="flex-shrink-0 mt-0.5">⚠️</span>
          <span>{t("results.disclaimer")}</span>
        </div>
      </div>

      <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-parchment cursor-pointer hover:border-gold-200 hover:bg-gold-50/30 transition bg-white">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              setField("consent", e.target.checked);
            }}
            className="peer sr-only"
          />
          <div className="w-6 h-6 rounded-lg border-2 border-navy-200 peer-checked:bg-navy-800 peer-checked:border-navy-800 transition flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-gold-300 opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <span className="text-sm text-navy-600 leading-relaxed">{t("consent.checkbox")}</span>
      </label>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 py-3.5 rounded-xl border-2 border-parchment text-navy-600 font-semibold hover:border-gold-200 hover:bg-gold-50/50 touch-target transition"
        >
          {t("common.back")}
        </button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!agreed || isLoading}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold hover:from-gold-400 hover:to-gold-300 disabled:opacity-40 disabled:cursor-not-allowed touch-target transition shadow-lg shadow-gold-500/20"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("submit.loading")}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {t("submit.evaluate")}
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
