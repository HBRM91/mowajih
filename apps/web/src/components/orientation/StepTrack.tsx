import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";
import { useGameStore } from "../../stores/gameStore";
import { motion } from "framer-motion";

const TRACK_META = [
  { key: "SM", icon: "🧮", color: "from-blue-500 to-blue-700", ring: "ring-blue-400", light: "bg-blue-50 border-blue-200" },
  { key: "PC", icon: "⚛️", color: "from-indigo-500 to-indigo-700", ring: "ring-indigo-400", light: "bg-indigo-50 border-indigo-200" },
  { key: "SVT", icon: "🧬", color: "from-emerald-500 to-emerald-700", ring: "ring-emerald-400", light: "bg-emerald-50 border-emerald-200" },
  { key: "SE", icon: "📊", color: "from-amber-500 to-amber-700", ring: "ring-amber-400", light: "bg-amber-50 border-amber-200" },
  { key: "SH", icon: "📚", color: "from-rose-500 to-rose-700", ring: "ring-rose-400", light: "bg-rose-50 border-rose-200" },
  { key: "STI", icon: "🔧", color: "from-slate-500 to-slate-700", ring: "ring-slate-400", light: "bg-slate-50 border-slate-200" },
  { key: "L", icon: "✍️", color: "from-purple-500 to-purple-700", ring: "ring-purple-400", light: "bg-purple-50 border-purple-200" },
];

export default function StepTrack() {
  const { t } = useTranslation();
  const { bacTrack, setField, nextStep } = useFormStore();
  const addXp = useGameStore((s) => s.addXp);

  const handleSelect = (track: string) => {
    setField("bacTrack", track);
    addXp(10, "Selected bac track");
    setTimeout(nextStep, 350);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="inline-flex items-center gap-1.5 text-gold-600 text-sm font-bold uppercase tracking-widest">
          <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
          {t("step.progress", { current: 1 })}
        </span>
        <h2 className="font-heading text-3xl font-bold text-navy-800 mt-2">{t("step.track")}</h2>
        <p className="text-navy-400 mt-2 text-sm">
          Quelle est ta filière au Baccalauréat ? (+10 XP 🎮)
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-3">
        {TRACK_META.map((track, idx) => (
          <motion.button
            key={track.key}
            type="button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(track.key)}
            className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all touch-target overflow-hidden ${
              bacTrack === track.key
                ? `${track.light} ring-2 ${track.ring} shadow-md`
                : "border-parchment hover:border-gold-200 bg-white hover:bg-gold-50/30"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
              {track.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-bold text-navy-800 text-base">{track.key}</span>
                <span className="text-xs text-navy-500">— {t(`track.${track.key}`)}</span>
              </div>
              <p className="text-xs text-navy-400 mt-0.5 leading-tight">{t(`track.${track.key}.desc`)}</p>
            </div>
            {bacTrack === track.key && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-7 h-7 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
              >
                <svg className="w-4 h-4 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-gold-600 bg-gold-50 border border-gold-200 rounded-xl px-4 py-3">
        <span className="text-lg">🎮</span>
        <span>Sélectionne ta filière pour gagner tes premiers <strong>10 XP</strong> et passer à l'étape suivante automatiquement !</span>
      </div>
    </div>
  );
}
