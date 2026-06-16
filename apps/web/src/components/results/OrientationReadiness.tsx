import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useFormStore } from "../../stores/formStore";
import { useProgressStore, getQuestStatus, getReadinessPercent, QUEST_TARGETS } from "../../stores/progressStore";
import { getSchoolCareers } from "../../data/careers";
import type { School } from "../../data/schools";

interface QuestRowProps {
  icon: string;
  title: string;
  desc: string;
  done: boolean;
  current: number;
  target: number;
  ctaLabel?: string;
  onCta?: () => void;
}

function QuestRow({ icon, title, desc, done, current, target, ctaLabel, onCta }: QuestRowProps) {
  const { t } = useTranslation();
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
      done ? "bg-emerald-50 border-emerald-200" : "bg-white border-parchment"
    }`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
        done ? "bg-emerald-100" : "bg-gold-50"
      }`}>
        {done ? "✅" : icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-sm ${done ? "text-emerald-700" : "text-navy-800"}`}>{title}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            done ? "bg-emerald-100 text-emerald-700" : "bg-navy-50 text-navy-400"
          }`}>
            {t("readiness.quest.progress", { current: Math.min(current, target), target })}
          </span>
        </div>
        <p className="text-xs text-navy-400 mt-0.5">{desc}</p>
      </div>
      {!done && ctaLabel && onCta && (
        <button
          type="button"
          onClick={onCta}
          className="flex-shrink-0 text-xs font-bold text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1.5 rounded-full hover:bg-gold-100 transition-colors"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

export default function OrientationReadiness({ topSchool }: { topSchool?: School | null }) {
  const { t } = useTranslation();
  const formStep = useFormStore((s) => s.step);
  const comparedSlugs = useProgressStore((s) => s.comparedSlugs);
  const viewedJobFamilies = useProgressStore((s) => s.viewedJobFamilies);
  const slimaneQueried = useProgressStore((s) => s.slimaneQueried);

  const progressState = { comparedSlugs, viewedJobFamilies, slimaneQueried };
  const quests = getQuestStatus(progressState);
  const percent = getReadinessPercent(formStep, progressState);
  const unlocked = quests.analyst || quests.explorer;

  const careers = topSchool ? getSchoolCareers(topSchool.slug) : null;
  const growth = careers ? Math.round(((careers.avgMidSalaryMAD - careers.avgStartSalaryMAD) / careers.avgStartSalaryMAD) * 100) : 0;
  const highlight = topSchool?.highlights?.[0] ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-6 bg-white rounded-3xl border border-gold-100/60 shadow-sm"
    >
      {/* Header + ring */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 60 60" className="w-16 h-16 -rotate-90">
            <circle cx="30" cy="30" r="26" fill="none" stroke="#f1ebe0" strokeWidth="6" />
            <motion.circle
              cx="30" cy="30" r="26" fill="none" stroke="#d4a843" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 26}
              initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - percent / 100) }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-heading font-bold text-navy-800 text-sm">
            {percent}%
          </div>
        </div>
        <div>
          <h3 className="font-heading font-bold text-navy-800 text-lg">{t("readiness.title")}</h3>
          <p className="text-navy-400 text-xs">{t("readiness.subtitle")}</p>
        </div>
      </div>

      {/* Quests */}
      <div className="space-y-2.5">
        <QuestRow
          icon="⚖️"
          title={t("readiness.quest.analyst.title")}
          desc={t("readiness.quest.analyst.desc")}
          done={quests.analyst}
          current={comparedSlugs.length}
          target={QUEST_TARGETS.compare}
        />
        <QuestRow
          icon="🧭"
          title={t("readiness.quest.explorer.title")}
          desc={t("readiness.quest.explorer.desc")}
          done={quests.explorer}
          current={viewedJobFamilies.length}
          target={QUEST_TARGETS.jobFamilies}
        />
        <QuestRow
          icon="🤖"
          title={t("readiness.quest.strategist.title")}
          desc={t("readiness.quest.strategist.desc")}
          done={quests.strategist}
          current={slimaneQueried ? 1 : 0}
          target={1}
          ctaLabel={t("readiness.quest.cta.slimane")}
          onCta={() => (window as any).__slimaneOpen?.()}
        />
      </div>

      {/* Unlockable insights */}
      <div className="mt-5 pt-5 border-t border-gold-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">{unlocked ? "🔓" : "🔒"}</span>
          <h4 className="font-heading font-bold text-navy-800 text-sm">{t("readiness.insights.title")}</h4>
        </div>
        {!unlocked ? (
          <div className="flex items-center gap-3 p-4 bg-navy-50/60 border border-navy-100 rounded-xl">
            <span className="text-navy-300 text-2xl flex-shrink-0">🔒</span>
            <p className="text-xs text-navy-400 leading-relaxed">{t("readiness.insights.locked")}</p>
            <Link
              to="/comparer"
              className="ml-auto flex-shrink-0 text-xs font-bold text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1.5 rounded-full hover:bg-gold-100 transition-colors whitespace-nowrap"
            >
              {t("readiness.quest.cta.compare")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {careers && (
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200 rounded-xl">
                <div className="text-xs font-bold text-emerald-700 mb-1">{t("readiness.insights.salary.title")}</div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {t("readiness.insights.salary.body", {
                    start: careers.avgStartSalaryMAD.toLocaleString("fr-FR"),
                    mid: careers.avgMidSalaryMAD.toLocaleString("fr-FR"),
                    growth,
                  })}
                </p>
              </div>
            )}
            {topSchool && (
              <div className="p-4 bg-gradient-to-br from-violet-50 to-violet-100/40 border border-violet-200 rounded-xl">
                <div className="text-xs font-bold text-violet-700 mb-1">{t("readiness.insights.admission.title")}</div>
                <p className="text-xs text-violet-800 leading-relaxed">
                  {t("readiness.insights.admission.body", { grade: topSchool.minGrade, highlight })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
