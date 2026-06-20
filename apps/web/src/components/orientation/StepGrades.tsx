import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";
import { motion } from "framer-motion";

function computeMention(grade: number) {
  if (grade >= 16) return "tres_bien";
  if (grade >= 14) return "bien";
  if (grade >= 12) return "assez_bien";
  return "passable";
}

const MENTION_COLORS: Record<string, string> = {
  tres_bien: "text-emerald-700 bg-emerald-50 border-emerald-200",
  bien:      "text-blue-700 bg-blue-50 border-blue-200",
  assez_bien:"text-amber-700 bg-amber-50 border-amber-200",
  passable:  "text-rose-700 bg-rose-50 border-rose-200",
};

const MENTION_LABELS: Record<string, string> = {
  tres_bien: "Très Bien ★★★★",
  bien:      "Bien ★★★☆",
  assez_bien:"Assez Bien ★★☆☆",
  passable:  "Passable ★☆☆☆",
};

type FormDataKey = keyof Omit<ReturnType<typeof useFormStore.getState>, "setField" | "nextStep" | "prevStep" | "reset" | "setSlimaneMode">;

interface GradeField {
  key: FormDataKey;
  label: string;
  placeholder?: string;
}

function getTrackFields(track: string, t: (k: string) => string): GradeField[] {
  const math:      GradeField = { key: "mathGrade",      label: t("grade.math"),          placeholder: "15" };
  const physics:   GradeField = { key: "physicsGrade",   label: t("grade.physics"),        placeholder: "13" };
  const biology:   GradeField = { key: "biologyGrade",   label: t("grade.biology"),        placeholder: "14" };
  const economics: GradeField = { key: "economicsGrade", label: t("grade.economics"),      placeholder: "15" };
  const history:   GradeField = { key: "historyGrade",   label: t("grade.history"),        placeholder: "12" };
  const tech:      GradeField = { key: "techGrade",      label: t("grade.tech_sciences"),  placeholder: "14" };

  switch (track) {
    case "SM":  return [math, physics];
    case "PC":  return [physics, math];
    case "SVT": return [biology, physics];
    case "SE":  return [economics, math];
    case "SH":  return [history, economics];
    case "STI": return [tech, physics, math];
    default:    return [];
  }
}

function normalizeDecimal(raw: string): string {
  return raw.replace(",", ".");
}

function clampGrade(raw: string): string {
  const normalized = normalizeDecimal(raw);
  const num = parseFloat(normalized);
  if (!isNaN(num) && num > 20) return "20";
  return normalized;
}

export default function StepGrades() {
  const { t } = useTranslation();
  const form = useFormStore();
  const numVal = form.generalGrade ? parseFloat(normalizeDecimal(form.generalGrade)) : null;
  const isValid = numVal !== null && numVal >= 0 && numVal <= 20;
  const mention = isValid && numVal !== null ? computeMention(numVal) : null;
  const trackFields = getTrackFields(form.bacTrack, t);

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-heading text-2xl font-bold text-navy-800">{t("step.grades")}</h2>
        <p className="text-navy-400 text-sm mt-1">{t("step.grades.hint")}</p>
      </div>

      <div className="space-y-4">
        {/* General grade — hero input */}
        <div className="bg-navy-50 rounded-2xl p-5 border border-navy-100">
          <label className="block text-sm font-bold text-navy-700 mb-3">
            {t("grade.general")} <span className="text-gold-600 text-xs font-semibold">({t("step.grades.required")})</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              value={form.generalGrade}
              onChange={(e) => form.setField("generalGrade", clampGrade(e.target.value))}
              onBlur={(e) => form.setField("generalGrade", clampGrade(e.target.value))}
              placeholder="Ex: 14.50"
              className="flex-1 px-4 py-3.5 rounded-xl border-2 border-navy-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-100 outline-none transition text-2xl font-bold text-navy-800 bg-white text-center"
            />
            <span className="text-navy-400 font-heading text-xl font-bold flex-shrink-0">/20</span>
          </div>
          {mention && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${MENTION_COLORS[mention]}`}>
                {MENTION_LABELS[mention]}
              </span>
            </motion.div>
          )}
        </div>

        {/* Subject grades */}
        {trackFields.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] text-gray-400 font-medium px-2 whitespace-nowrap">{t("step.grades.subjects")} <span className="text-gray-300">({t("step.grades.optional")})</span></span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {trackFields.map((field) => {
                const val = (form[field.key] as string) || "";
                const num = val ? parseFloat(normalizeDecimal(val)) : null;
                const ok = num !== null && num >= 0 && num <= 20;
                return (
                  <div key={field.key as string} className="bg-white rounded-xl border-2 border-gray-100 p-3.5 hover:border-gold-200 transition-colors">
                    <label className="block text-xs font-bold text-navy-600 mb-2 leading-tight">{field.label}</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={val}
                        onChange={(e) => form.setField(field.key, clampGrade(e.target.value))}
                        onBlur={(e) => form.setField(field.key, clampGrade(e.target.value))}
                        placeholder={field.placeholder ?? "0"}
                        className="flex-1 min-w-0 px-2.5 py-2 rounded-lg border border-gray-200 focus:border-gold-400 focus:ring-1 focus:ring-gold-100 outline-none transition text-base font-bold text-navy-800 bg-cream text-center"
                      />
                      <span className="text-gray-400 text-xs font-medium flex-shrink-0">/20</span>
                      {val && ok && (
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info note */}
        <div className="flex items-start gap-2 text-[11px] text-blue-600 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-3">
          <span className="flex-shrink-0 mt-0.5">ℹ</span>
          <span>{t("step.grades.tawjihi_note")}</span>
        </div>
      </div>

      {/* Buttons — equal width, consistent layout */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={form.prevStep}
          className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-300 hover:bg-gray-50 transition text-sm"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={form.nextStep}
          disabled={!isValid}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold hover:from-navy-800 hover:to-navy-900 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-navy-900/20 text-sm"
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
