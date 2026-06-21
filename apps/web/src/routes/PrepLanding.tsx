import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { EXAM_META, type Exam } from "../data/prepQuestions";
import { usePrepStore, XP_THRESHOLDS_EXPORT } from "../stores/prepStore";

function XPBar({ exam }: { exam: Exam }) {
  const { getTotalXP, getLevel } = usePrepStore();
  const xp = getTotalXP(exam);
  const level = getLevel(exam);
  const meta = EXAM_META[exam];
  const nextThreshold = XP_THRESHOLDS_EXPORT[Math.min(level + 1, 3)];
  const currentThreshold = XP_THRESHOLDS_EXPORT[level];
  const pct = level >= 3 ? 100 : Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-bold text-navy-700">{meta.levels[level]}</span>
        <span className="text-navy-400">⚡ {xp} XP</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {level < 3 && (
        <div className="text-[10px] text-navy-400 mt-0.5 text-right">
          {nextThreshold - xp} XP pour {meta.levels[level + 1]}
        </div>
      )}
    </div>
  );
}

export default function PrepLanding() {
  const { progress, getOverallAccuracy } = usePrepStore();

  const exams: Exam[] = ["ensa", "ena", "encg"];

  return (
    <>
      <Helmet>
        <title>Prépare ton Concours — JAD2 TAWJIH | ENSA, ENA, ENCG TAFEM</title>
        <meta name="description" content="Prépare le concours ENSA, ENA ou ENCG (TAFEM) avec des questions réelles, des simulations d'examen et un suivi de progression personnalisé. Gratuit." />
        <link rel="canonical" href="https://tawjih.jad2advisory.com/prep" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 pt-12 pb-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/15 border border-gold-500/30 rounded-full text-gold-300 text-sm font-bold mb-6">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              Nouveau — Préparation aux Concours 2026
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Prépare ton concours<br />
              <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
                avec de vraies questions
              </span>
            </h1>
            <p className="text-navy-300 text-lg max-w-2xl mx-auto mb-8">
              Questions basées sur les sujets réels 2025. Diagnostic rapide, entraînement par sujet, simulation d'examen complet.
            </p>

            {/* How it works */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-10">
              {[
                { step: "01", icon: "🎯", label: "Diagnostic 10 min" },
                { step: "02", icon: "📚", label: "Entraînement ciblé" },
                { step: "03", icon: "⏱️", label: "Exam complet chrono" },
              ].map((s) => (
                <div key={s.step} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-[10px] text-navy-400 font-bold uppercase tracking-wider">{s.step}</div>
                  <div className="text-xs text-white font-semibold mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Exam cards */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {exams.map((exam, i) => {
              const meta = EXAM_META[exam];
              const prog = progress[exam];
              const accuracy = getOverallAccuracy(exam);
              const hasSessions = prog.sessions > 0;

              return (
                <motion.div
                  key={exam}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-navy-950/50 h-full flex flex-col">
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${meta.color} px-5 py-5 text-white`}>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{meta.icon}</span>
                        <div>
                          <div className="font-heading font-black text-xl">{meta.label}</div>
                          <div className="text-white/70 text-xs leading-tight mt-0.5">{meta.fullName}</div>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="px-5 py-4 flex-1 flex flex-col">
                      {/* Exam info */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-xs text-navy-500">
                          <span>⏱️</span><span>{meta.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-navy-500">
                          <span>📋</span><span>{meta.format}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold">
                          <span>📅</span><span>{meta.date}</span>
                        </div>
                      </div>

                      {/* Progress (if started) */}
                      {hasSessions && (
                        <div className="mb-4 p-3 bg-gold-50 border border-gold-200 rounded-xl">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-bold text-navy-700">Ta progression</span>
                            <span className="text-navy-500">{prog.totalAnswered} réponses</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-emerald-400"
                                  style={{ width: `${accuracy}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm font-bold text-navy-700 flex-shrink-0">{accuracy}%</span>
                          </div>
                          <XPBar exam={exam} />
                          {prog.streak > 1 && (
                            <div className="text-[10px] text-amber-700 font-bold mt-1.5">
                              🔥 {prog.streak} jours de suite
                            </div>
                          )}
                        </div>
                      )}

                      {/* Subjects preview */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {meta.subjects.slice(0, 4).map((s) => (
                          <span key={s.key} className="text-[10px] px-2 py-0.5 bg-gray-100 text-navy-600 rounded-full">
                            {s.icon} {s.label}
                          </span>
                        ))}
                        {meta.subjects.length > 4 && (
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-navy-400 rounded-full">
                            +{meta.subjects.length - 4}
                          </span>
                        )}
                      </div>

                      {/* CTAs */}
                      <div className="mt-auto space-y-2">
                        {!hasSessions ? (
                          <Link
                            to={`/prep/${exam}/session`}
                            state={{ mode: "diagnostic", exam }}
                            className="block w-full text-center py-3.5 rounded-2xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold text-sm hover:from-navy-800 hover:to-navy-900 transition-all shadow-md"
                          >
                            🎯 Commencer le diagnostic
                          </Link>
                        ) : (
                          <>
                            <Link
                              to={`/prep/${exam}/session`}
                              state={{ mode: "diagnostic", exam }}
                              className="block w-full text-center py-3 rounded-2xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold text-sm hover:from-navy-800 hover:to-navy-900 transition-all"
                            >
                              📚 S'entraîner
                            </Link>
                            <Link
                              to={`/prep/${exam}/session`}
                              state={{ mode: "exam", exam }}
                              className="block w-full text-center py-3 rounded-2xl border-2 border-gold-300 text-gold-700 font-bold text-sm hover:bg-gold-50 transition-all"
                            >
                              ⏱️ Simulation d'examen
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CNDP note */}
          <p className="text-center text-navy-500 text-xs mt-8">
            🛡️ Aucune donnée personnelle collectée · Progression sauvegardée localement · Conforme CNDP
          </p>
        </div>
      </div>
    </>
  );
}
