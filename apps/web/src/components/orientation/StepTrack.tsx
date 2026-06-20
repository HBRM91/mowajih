import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";
import { motion } from "framer-motion";

const TRACK_META = [
  { key: "SM",  icon: "🧮", gradient: "from-blue-500 to-blue-700",     light: "bg-blue-50  border-blue-300  text-blue-900"   },
  { key: "PC",  icon: "⚛️", gradient: "from-indigo-500 to-indigo-700",  light: "bg-indigo-50 border-indigo-300 text-indigo-900" },
  { key: "SVT", icon: "🧬", gradient: "from-emerald-500 to-emerald-700",light: "bg-emerald-50 border-emerald-300 text-emerald-900" },
  { key: "SE",  icon: "📊", gradient: "from-amber-500 to-amber-700",    light: "bg-amber-50  border-amber-300  text-amber-900"  },
  { key: "SH",  icon: "📚", gradient: "from-rose-500 to-rose-700",      light: "bg-rose-50   border-rose-300   text-rose-900"   },
  { key: "STI", icon: "🔧", gradient: "from-slate-500 to-slate-700",    light: "bg-slate-50  border-slate-300  text-slate-900"  },
  { key: "L",   icon: "✍️", gradient: "from-purple-500 to-purple-700",  light: "bg-purple-50 border-purple-300 text-purple-900" },
];

export default function StepTrack() {
  const { t } = useTranslation();
  const { bacTrack, setField, nextStep } = useFormStore();

  const handleSelect = (track: string) => {
    setField("bacTrack", track);
    setTimeout(nextStep, 280);
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-heading text-2xl font-bold text-navy-800">{t("step.track")}</h2>
        <p className="text-navy-400 text-sm mt-1">{t("step.track.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {TRACK_META.map((track, idx) => {
          const selected = bacTrack === track.key;
          // Last item when count is odd → full-width horizontal card
          const isWide = TRACK_META.length % 2 !== 0 && idx === TRACK_META.length - 1;

          return (
            <motion.button
              key={track.key}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(track.key)}
              className={[
                "relative rounded-2xl border-2 transition-all duration-200",
                isWide
                  ? "col-span-2 flex items-center gap-4 py-3 px-4 text-left"
                  : "flex flex-col items-center gap-2 py-4 px-3 text-center min-h-[108px] justify-center",
                selected
                  ? `${track.light} border-current shadow-md`
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
              ].join(" ")}
            >
              {/* Checkmark */}
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Icon */}
              <div className={`bg-gradient-to-br ${track.gradient} flex items-center justify-center text-2xl shadow-sm flex-shrink-0 ${isWide ? "w-12 h-12 rounded-xl" : "w-12 h-12 rounded-xl"}`}>
                {track.icon}
              </div>

              {/* Label */}
              <div className={isWide ? "" : "text-center"}>
                <div className={`font-heading font-bold text-sm ${selected ? "text-current" : "text-navy-800"}`}>
                  Bac {track.key}
                </div>
                <div className="text-[11px] text-navy-400 leading-tight mt-0.5">
                  {t(`track.${track.key}`)}
                </div>
                {isWide && (
                  <div className="text-[10px] text-navy-300 mt-1">{t(`track.${track.key}.desc`)}</div>
                )}
              </div>

              {isWide && (
                <div className="ml-auto flex-shrink-0 text-navy-300 text-sm">→</div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gold-700 bg-gold-50 border border-gold-200 rounded-xl px-3 py-2.5">
        <span className="flex-shrink-0">💡</span>
        <span>{t("step.track.hint")}</span>
      </div>
    </div>
  );
}
