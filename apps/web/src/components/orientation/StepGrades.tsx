import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";
import { useGameStore } from "../../stores/gameStore";
import { motion } from "framer-motion";

function computeMention(grade: number) {
  if (grade >= 16) return "Très Bien";
  if (grade >= 14) return "Bien";
  if (grade >= 12) return "Assez Bien";
  return "Passable";
}

function mentionStars(mention: string) {
  const map: Record<string, string> = {
    "Passable": "⭐",
    "Assez Bien": "⭐⭐",
    "Bien": "⭐⭐⭐",
    "Très Bien": "⭐⭐⭐⭐",
  };
  return map[mention] || "";
}

export default function StepGrades() {
  const { t } = useTranslation();
  const { generalGrade, mathGrade, physicsGrade, setField, nextStep, prevStep } = useFormStore();
  const addXp = useGameStore((s) => s.addXp);

  const mention = generalGrade ? computeMention(parseFloat(generalGrade)) : null;
  const isValid = generalGrade && parseFloat(generalGrade) >= 0 && parseFloat(generalGrade) <= 20;

  const handleNext = () => {
    addXp(15, "Entered grades");
    nextStep();
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <span className="text-gold-600 text-sm font-semibold uppercase tracking-wider">Étape 2 / 4</span>
        <h2 className="font-heading text-3xl font-bold text-navy-800 mt-2">{t("step.grades")}</h2>
        <p className="text-navy-400 mt-2">Entre tes notes sur 20. Pas de pression, on est là pour t'aider.</p>
      </motion.div>

      <div className="space-y-5">
        <div className="bg-white p-5 rounded-2xl border border-gold-100/50">
          <label className="block text-sm font-semibold text-navy-700 mb-2">{t("grade.general")} *</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={20}
              step={0.01}
              value={generalGrade}
              onChange={(e) => setField("generalGrade", e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-parchment focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none transition text-lg font-bold text-navy-800 bg-cream"
              placeholder="Ex: 14.5"
            />
            <span className="text-navy-300 font-heading text-xl font-bold">/20</span>
          </div>
          {mention && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 flex items-center gap-2"
            >
              <span className="text-sm text-navy-500">{t("mention.predicted")}:</span>
              <span className="text-sm font-bold text-gold-600">{mention}</span>
              <span className="text-sm">{mentionStars(mention)}</span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gold-100/50">
            <label className="block text-sm font-semibold text-navy-700 mb-2">{t("grade.math")}</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={20}
                step={0.01}
                value={mathGrade}
                onChange={(e) => setField("mathGrade", e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-parchment focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none transition bg-cream"
                placeholder="15"
              />
              <span className="text-navy-300 font-medium">/20</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gold-100/50">
            <label className="block text-sm font-semibold text-navy-700 mb-2">{t("grade.physics")}</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={20}
                step={0.01}
                value={physicsGrade}
                onChange={(e) => setField("physicsGrade", e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-parchment focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none transition bg-cream"
                placeholder="13.5"
              />
              <span className="text-navy-300 font-medium">/20</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={prevStep}
          className="flex-1 py-3.5 rounded-xl border-2 border-parchment text-navy-600 font-semibold hover:border-gold-200 hover:bg-gold-50/50 touch-target transition"
        >
          Retour
        </button>
        <button
          onClick={handleNext}
          disabled={!isValid}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-semibold hover:from-navy-800 hover:to-navy-900 disabled:opacity-40 disabled:cursor-not-allowed touch-target transition shadow-lg shadow-navy-900/10"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
