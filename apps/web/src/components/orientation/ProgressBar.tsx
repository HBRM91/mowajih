import { motion } from "framer-motion";

const steps = [
  { label: "Filière", icon: "🎓" },
  { label: "Notes", icon: "📝" },
  { label: "Profil", icon: "📍" },
];

const XP_PER_STEP = [10, 15, 15];

const STEP_BENEFIT = [
  "80% de tes choix dépendent de ta filière",
  "Critère n°1 de sélection dans toutes les écoles",
  "On optimise les recommandations pour ta ville",
];

export default function ProgressBar({ step }: { step: number }) {
  const totalXp = XP_PER_STEP.slice(0, step - 1).reduce((a, b) => a + b, 0);
  const benefit = STEP_BENEFIT[step - 1];

  return (
    <div className="mb-4">
      {/* Steps */}
      <div className="flex items-center mb-3">
        {steps.map((s, idx) => {
          const num = idx + 1;
          const active = num === step;
          const completed = num < step;

          return (
            <div key={s.label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center relative">
                <motion.div
                  animate={{ scale: active ? 1.15 : completed ? 1 : 0.9 }}
                  transition={{ type: "spring", damping: 12 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-colors shadow-sm ${
                    completed
                      ? "bg-emerald-500 border-emerald-400 text-white"
                      : active
                        ? "bg-gradient-to-br from-navy-700 to-navy-800 border-gold-400 text-gold-300 shadow-md"
                        : "bg-parchment border-gray-200 text-navy-300"
                  }`}
                >
                  {completed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={active ? "" : "opacity-50"}>{s.icon}</span>
                  )}
                </motion.div>
                <span className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider whitespace-nowrap ${
                  active ? "text-navy-800" : completed ? "text-emerald-600" : "text-navy-300"
                }`}>
                  {s.label}
                </span>
              </div>

              {num < steps.length && (
                <div className="flex-1 h-1 mx-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: completed ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contextual benefit + XP */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-navy-400 italic">
          <span>💡</span>
          <span>{benefit}</span>
        </div>
        <div className="flex items-center gap-1 text-gold-600 font-semibold flex-shrink-0 ml-2">
          <span>⚡</span>
          <span>{totalXp} XP</span>
        </div>
      </div>
    </div>
  );
}
