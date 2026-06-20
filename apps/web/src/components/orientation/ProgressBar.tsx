import { motion } from "framer-motion";

const STEPS = [
  { label: "Filière", icon: "🎓" },
  { label: "Notes", icon: "📝" },
  { label: "Profil", icon: "📍" },
];

export default function ProgressBar({ step }: { step: number }) {
  return (
    <div className="px-6 pt-5 pb-4">
      <div className="flex items-center">
        {STEPS.map((s, i) => {
          const num = i + 1;
          const done = num < step;
          const active = num === step;
          return (
            <div key={s.label} className="flex-1 flex items-center">
              {/* Circle */}
              <div className="flex flex-col items-center flex-shrink-0">
                <motion.div
                  animate={{ scale: active ? 1.1 : 1 }}
                  transition={{ type: "spring", damping: 14 }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                    done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : active
                        ? "bg-navy-800 border-gold-400 text-gold-300"
                        : "bg-gray-100 border-gray-200 text-gray-400"
                  }`}
                >
                  {done ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{num}</span>
                  )}
                </motion.div>
                <span className={`text-[10px] font-semibold mt-1 tracking-wide ${
                  done ? "text-emerald-600" : active ? "text-navy-700" : "text-gray-400"
                }`}>
                  {s.label}
                </span>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-4 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-400 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
