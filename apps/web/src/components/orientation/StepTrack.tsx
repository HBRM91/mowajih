import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";
import { motion } from "framer-motion";

const TRACK_META = [
  { key: "SM",  icon: "🧮", gradient: "from-blue-500 to-blue-700",    light: "bg-blue-50  border-blue-300  text-blue-900"  },
  { key: "PC",  icon: "⚛️", gradient: "from-indigo-500 to-indigo-700", light: "bg-indigo-50 border-indigo-300 text-indigo-900" },
  { key: "SVT", icon: "🧬", gradient: "from-emerald-500 to-emerald-700",light: "bg-emerald-50 border-emerald-300 text-emerald-900" },
  { key: "SE",  icon: "📊", gradient: "from-amber-500 to-amber-700",   light: "bg-amber-50  border-amber-300  text-amber-900"  },
  { key: "SH",  icon: "📚", gradient: "from-rose-500 to-rose-700",     light: "bg-rose-50   border-rose-300   text-rose-900"   },
  { key: "STI", icon: "🔧", gradient: "from-slate-500 to-slate-700",   light: "bg-slate-50  border-slate-300  text-slate-900"  },
  { key: "L",   icon: "✍️", gradient: "from-purple-500 to-purple-700", light: "bg-purple-50 border-purple-300 text-purple-900" },
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
          return (
            <motion.button
              key={track.key}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelect(track.key)}
              className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 text-center transition-all duration-200 ${
                selected
                  ? `${track.light} border-current shadow-md ring-2 ring-offset-1 ring-current/20`
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {/* Selected checkmark */}
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Icon circle */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.gradient} flex items-center justify-center text-2xl shadow-sm flex-shrink-0`}>
                {track.icon}
              </div>

              {/* Label */}
              <div>
                <div className={`font-heading font-bold text-sm ${selected ? "text-current" : "text-navy-800"}`}>
                  Bac {track.key}
                </div>
                <div className="text-[11px] text-navy-400 leading-tight mt-0.5 line-clamp-1">
                  {t(`track.${track.key}`)}
                </div>
              </div>
            </motion.button>
          );
        })}

        {/* Spacer to keep even grid when 7 items (odd) */}
        {TRACK_META.length % 2 !== 0 && <div />}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gold-700 bg-gold-50 border border-gold-200 rounded-xl px-3 py-2.5">
        <span>💡</span>
        <span>{t("step.track.hint")}</span>
      </div>
    </div>
  );
}
