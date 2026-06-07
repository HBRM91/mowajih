import { motion } from "framer-motion";
import { useGameStore, getLevelName, getLevelProgress, getXpForNextLevel } from "../../stores/gameStore";
import { useTranslation } from "react-i18next";

export default function XPBar() {
  const { xp, level } = useGameStore();
  const { t } = useTranslation();
  const progress = getLevelProgress(xp);
  const nextLevelXp = getXpForNextLevel(xp);

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-navy-800/90 backdrop-blur rounded-full border border-gold-500/30">
      <div className="flex flex-col items-center">
        <span className="text-[9px] uppercase tracking-wider text-gold-300 font-semibold">{t("level.label")}</span>
        <span className="text-sm font-bold text-white leading-none">{level}</span>
      </div>
      <div className="w-24 h-2 bg-navy-900 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="text-[10px] text-gold-200/80">
        <span className="font-bold text-gold-300">{xp}</span> / {nextLevelXp} {t("xp.label")}
      </div>
    </div>
  );
}

export function LevelUpModal() {
  const { showLevelUp, level, dismissLevelUp } = useGameStore();
  const { t } = useTranslation();

  if (!showLevelUp) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/60 backdrop-blur-sm"
      onClick={dismissLevelUp}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12 }}
        className="bg-gradient-to-b from-navy-800 to-navy-900 p-8 rounded-3xl border border-gold-400/40 shadow-2xl text-center max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          🏆
        </motion.div>
        <h3 className="font-heading text-2xl font-bold text-gold-300 mb-2">{t("gamification.level_up")}</h3>
        <p className="text-gold-100/80 mb-2">{t(getLevelName(level))}</p>
        <div className="text-5xl font-heading font-bold text-white mb-6">{level}</div>
        <button
          onClick={dismissLevelUp}
          className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold rounded-full hover:from-gold-400 hover:to-gold-300 transition shadow-lg"
        >
          Continuer
        </button>
      </motion.div>
    </motion.div>
  );
}

export function BadgeNotification() {
  const { lastBadgeEarned, dismissBadge } = useGameStore();
  const { t } = useTranslation();

  if (!lastBadgeEarned) return null;

  const badgeEmojis: Record<string, string> = {
    new: "🌟",
    first_match: "🎯",
    explorer: "🧭",
    optin_hero: "🔓",
    strategist: "♟️",
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="fixed top-20 right-4 z-[60] bg-gradient-to-r from-navy-800 to-navy-700 text-white px-5 py-4 rounded-2xl border border-gold-400/40 shadow-2xl flex items-center gap-3"
    >
      <span className="text-3xl">{badgeEmojis[lastBadgeEarned]}</span>
      <div>
        <div className="text-xs text-gold-300 uppercase tracking-wider font-semibold">{t("badge.new")}</div>
        <div className="font-heading font-bold">{t(`badge.${lastBadgeEarned}`)}</div>
        <div className="text-xs text-gold-200/70">+50 XP</div>
      </div>
      <button onClick={dismissBadge} className="ml-2 text-white/50 hover:text-white">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}
