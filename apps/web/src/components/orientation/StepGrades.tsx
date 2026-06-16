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
  tres_bien: "text-emerald-600 bg-emerald-50 border-emerald-200",
  bien: "text-blue-600 bg-blue-50 border-blue-200",
  assez_bien: "text-amber-600 bg-amber-50 border-amber-200",
  passable: "text-rose-600 bg-rose-50 border-rose-200",
};

const MENTION_STARS: Record<string, string> = {
  tres_bien: "★★★★",
  bien: "★★★☆",
  assez_bien: "★★☆☆",
  passable: "★☆☆☆",
};

type FormDataKey = keyof Omit<ReturnType<typeof useFormStore.getState>, "setField" | "nextStep" | "prevStep" | "reset" | "setSlimaneMode">;

interface GradeField {
  key: FormDataKey;
  label: string;
  required?: boolean;
  placeholder?: string;
}

function getTrackFields(track: string, t: (k: string) => string): GradeField[] {
  const math: GradeField = { key: "mathGrade", label: t("grade.math"), placeholder: "15" };
  const physics: GradeField = { key: "physicsGrade", label: t("grade.physics"), placeholder: "13" };
  const french: GradeField = { key: "frenchGrade", label: t("grade.french"), placeholder: "12" };
  const arabic: GradeField = { key: "arabicGrade", label: t("grade.arabic"), placeholder: "13" };
  const philosophy: GradeField = { key: "philosophyGrade", label: t("grade.philosophy"), placeholder: "11" };
  const biology: GradeField = { key: "biologyGrade", label: t("grade.biology"), placeholder: "14" };
  const economics: GradeField = { key: "economicsGrade", label: t("grade.economics"), placeholder: "15" };
  const history: GradeField = { key: "historyGrade", label: t("grade.history"), placeholder: "12" };
  const tech: GradeField = { key: "techGrade", label: t("grade.tech_sciences"), placeholder: "14" };
  const english: GradeField = { key: "englishGrade", label: t("grade.english"), placeholder: "13" };

  switch (track) {
    case "SM":
      return [math, physics, french, arabic, philosophy, english];
    case "PC":
      return [physics, math, biology, french, arabic, philosophy, english];
    case "SVT":
      return [biology, physics, math, french, arabic, philosophy, english];
    case "SE":
      return [economics, math, history, french, arabic, philosophy, english];
    case "SH":
      return [french, arabic, philosophy, history, economics, english];
    case "STI":
      return [tech, math, physics, french, arabic, english];
    case "L":
      return [french, arabic, philosophy, history, english];
    default:
      return [math, physics, french];
  }
}

interface GradeInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}

function GradeInput({ label, value, onChange, placeholder = "0", required }: GradeInputProps) {
  const { t } = useTranslation();
  const numVal = value ? parseFloat(value) : null;
  const isValid = numVal !== null && numVal >= 0 && numVal <= 20;

  return (
    <div className="bg-white rounded-xl border border-gold-100/70 p-4 hover:border-gold-200 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-navy-700 leading-tight">{label}</label>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
          required
            ? "bg-gold-50 text-gold-700 border-gold-200"
            : "bg-gray-50 text-gray-500 border-gray-200"
        }`}>
          {required ? t("step.grades.required") : t("step.grades.optional")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={20}
          step={0.25}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 px-3 py-2.5 rounded-lg border-2 text-sm font-bold text-navy-800 bg-cream outline-none transition ${
            value && !isValid
              ? "border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              : "border-parchment focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
          }`}
          placeholder={placeholder}
        />
        <span className="text-navy-300 font-medium text-sm flex-shrink-0">/20</span>
        {value && isValid && (
          <span className="text-emerald-500 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}

export default function StepGrades() {
  const { t } = useTranslation();
  const form = useFormStore();
  const mention = form.generalGrade ? computeMention(parseFloat(form.generalGrade)) : null;
  const isValid = !!form.generalGrade && parseFloat(form.generalGrade) >= 0 && parseFloat(form.generalGrade) <= 20;

  const handleNext = () => {
    form.nextStep();
  };

  const trackFields = getTrackFields(form.bacTrack, t);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <span className="text-gold-600 text-sm font-semibold uppercase tracking-wider">
          {t("step.progress", { current: 2 })}
        </span>
        <h2 className="font-heading text-3xl font-bold text-navy-800 mt-2">{t("step.grades")}</h2>
        <p className="text-navy-400 mt-2 text-sm">{t("step.grades.hint")}</p>
      </motion.div>

      <div className="space-y-4">
        {/* General grade — always first and prominent */}
        <div className="bg-gradient-to-br from-navy-50 to-cream p-5 rounded-2xl border-2 border-navy-100">
          <label className="block text-sm font-bold text-navy-700 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 bg-navy-800 rounded-full flex items-center justify-center text-gold-300 text-[10px] font-bold">★</span>
            {t("grade.general")}
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gold-50 text-gold-700 border border-gold-200">
              {t("step.grades.required")}
            </span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={20}
              step={0.25}
              value={form.generalGrade}
              onChange={(e) => form.setField("generalGrade", e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-xl border-2 border-parchment focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none transition text-xl font-bold text-navy-800 bg-white"
              placeholder="Ex: 14.50"
            />
            <span className="text-navy-400 font-heading text-xl font-bold">/20</span>
          </div>
          {mention && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2"
            >
              <span className="text-xs text-navy-500">{t("mention.predicted")} :</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${MENTION_COLORS[mention]}`}>
                {MENTION_STARS[mention]} {t(`mention.${mention}`)}
              </span>
            </motion.div>
          )}
        </div>

        {/* Subject-specific grades based on track */}
        {trackFields.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-gold-100" />
              <span className="text-xs text-navy-400 font-medium px-2">{t("step.grades.subjects")}</span>
              <div className="flex-1 h-px bg-gold-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trackFields.map((field) => (
                <GradeInput
                  key={field.key as string}
                  label={field.label}
                  value={(form[field.key] as string) || ""}
                  onChange={(v) => form.setField(field.key, v)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tawjihi formula note */}
        <div className="flex items-start gap-2 text-[11px] text-navy-400 bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-3">
          <span className="text-blue-400 flex-shrink-0 mt-0.5">ℹ</span>
          <span>{t("step.grades.tawjihi_note")}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={form.prevStep}
          className="flex-1 py-3.5 rounded-xl border-2 border-parchment text-navy-600 font-semibold hover:border-gold-200 hover:bg-gold-50/50 touch-target transition"
        >
          {t("common.back")}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isValid}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold hover:from-navy-800 hover:to-navy-900 disabled:opacity-40 disabled:cursor-not-allowed touch-target transition shadow-lg shadow-navy-900/10"
        >
          {t("common.next")}
        </button>
      </div>
    </div>
  );
}
