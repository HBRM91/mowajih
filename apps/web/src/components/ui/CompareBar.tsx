import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCompareStore } from "../../stores/compareStore";
import SchoolLogo from "./SchoolLogo";

export default function CompareBar() {
  const { t } = useTranslation();
  const { schools, remove, clear } = useCompareStore();

  return (
    <AnimatePresence>
      {schools.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-navy-900 border border-white/10 rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4"
          style={{ maxWidth: "calc(100vw - 2rem)" }}
        >
          <div className="flex items-center gap-2">
            {schools.map((s) => (
              <div key={s.slug} className="relative group">
                <SchoolLogo school={s} size="sm" />
                <button
                  onClick={() => remove(s.slug)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title={t("compare.bar.remove")}
                >
                  ×
                </button>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-white/50 hidden group-hover:block">
                  {s.shortName}
                </div>
              </div>
            ))}
            {schools.length < 3 && Array.from({ length: 3 - schools.length }).map((_, i) => (
              <div key={i} className="w-9 h-9 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center">
                <span className="text-white/30 text-lg">+</span>
              </div>
            ))}
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="text-white/60 text-xs font-medium whitespace-nowrap">
              {schools.length}/3 {t("compare.bar.count", { count: schools.length })}
            </span>
            <Link
              to="/comparer"
              className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-xl text-xs font-bold hover:from-gold-400 hover:to-gold-300 transition-all whitespace-nowrap shadow-lg"
            >
              {t("compare.bar.cta")} →
            </Link>
            <button
              onClick={clear}
              className="text-white/30 hover:text-white/70 transition text-xs"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
