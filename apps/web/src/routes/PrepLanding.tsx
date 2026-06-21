import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { EXAM_META, type Exam, getQuestionsByExam } from "../data/prepQuestions";
import { usePrepStore, XP_THRESHOLDS_EXPORT } from "../stores/prepStore";

const EXAMS: Exam[] = ["ensa", "ena", "encg", "fmp"];

function getDaysUntilDate(dateStr: string): number {
  const match = dateStr.match(/~?(\d+)\s+(\w+)\s+(\d{4})/);
  if (!match) return 0;
  const monthMap: Record<string, number> = {
    janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
    juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11,
  };
  const d = parseInt(match[1]);
  const m = monthMap[match[2].toLowerCase()] ?? 0;
  const y = parseInt(match[3]);
  const target = new Date(y, m, d);
  const diff = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function LevelBadge({ exam }: { exam: Exam }) {
  const { getTotalXP, getLevel } = usePrepStore();
  const xp = getTotalXP(exam);
  const level = getLevel(exam);
  const meta = EXAM_META[exam];
  const next = XP_THRESHOLDS_EXPORT[Math.min(level + 1, 3)];
  const curr = XP_THRESHOLDS_EXPORT[level];
  const pct = level >= 3 ? 100 : Math.round(((xp - curr) / (next - curr)) * 100);

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-bold text-navy-700">{meta.levels[level]}</span>
        <span className="text-gold-600 font-bold">⚡ {xp} XP</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function PrepLanding() {
  const { progress, getOverallAccuracy } = usePrepStore();

  return (
    <>
      <Helmet>
        <title>Prépare ton Concours ENSA, ENA, ENCG, FMP — JAD2 TAWJIH 2026</title>
        <meta name="description" content="Questions réelles 2025, simulations chronométrées et entraînement par sujet pour les concours ENSA, ENA, ENCG/TAFEM et FMP Médecine. Gratuit." />
        <link rel="canonical" href="https://tawjih.jad2advisory.com/prep" />
      </Helmet>

      <div className="min-h-screen bg-navy-950">

        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

          <div className="relative max-w-5xl mx-auto px-4 pt-14 pb-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/15 border border-gold-500/30 rounded-full text-gold-300 text-xs font-bold mb-5">
                <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
                NOUVEAU — Prép Concours 2026 • Questions réelles
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Prépare ton concours.<br/>
                <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
                  Réussit-le.
                </span>
              </h1>
              <p className="text-navy-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
                Questions basées sur les sujets officiels 2025 · Explication de chaque réponse ·
                Simulation chronométrée identique au vrai concours
              </p>

              {/* Steps */}
              <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
                {[
                  { n: "1", label: "Diagnostic 10 min" },
                  { n: "2", label: "Entraîne par sujet" },
                  { n: "3", label: "Simule l'examen" },
                ].map((s, i) => (
                  <div key={s.n} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-xl px-3 py-2">
                      <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 text-[10px] font-black flex items-center justify-center">{s.n}</span>
                      <span className="text-xs text-white/80 font-medium">{s.label}</span>
                    </div>
                    {i < 2 && <span className="text-navy-600 text-xs">→</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Exam cards */}
        <div className="max-w-5xl mx-auto px-4 pb-16 -mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXAMS.map((exam, i) => {
              const meta = EXAM_META[exam];
              const prog = progress[exam];
              const accuracy = getOverallAccuracy(exam);
              const started = prog.sessions > 0;
              const totalQ = getQuestionsByExam(exam).length;
              const daysLeft = getDaysUntilDate(meta.date);

              return (
                <motion.div
                  key={exam}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col"
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-navy-950/60 flex flex-col h-full">

                    {/* Header gradient */}
                    <div className={`bg-gradient-to-br ${meta.color} px-4 py-4 text-white`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-3xl mb-1">{meta.icon}</div>
                          <div className="font-heading font-black text-lg leading-tight">{meta.label}</div>
                          <div className="text-white/70 text-[11px] leading-tight mt-0.5">{meta.fullName}</div>
                        </div>
                        {daysLeft > 0 && daysLeft <= 60 && (
                          <div className="flex-shrink-0 text-center">
                            <div className="font-heading font-black text-2xl leading-none">{daysLeft}</div>
                            <div className="text-white/70 text-[9px] font-bold uppercase">jours</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="px-4 py-3 flex-1 flex flex-col">
                      {/* Exam info */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-navy-500">
                          <span>⏱️</span><span className="truncate">{meta.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-navy-500">
                          <span>📋</span><span className="truncate">{meta.format}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-semibold">
                          <span>📅</span><span>{meta.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gold-700 font-medium">
                          <span>❓</span><span>{totalQ} questions disponibles</span>
                        </div>
                      </div>

                      {/* Progress if started */}
                      {started && (
                        <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-emerald-700">Ta progression</span>
                            <span className="text-emerald-600">{accuracy}% correct</span>
                          </div>
                          <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${accuracy}%` }} />
                          </div>
                          <div className="text-[10px] text-emerald-600 mt-1">{prog.totalAnswered} réponses · {prog.sessions} session{prog.sessions > 1 ? "s" : ""}</div>
                          <LevelBadge exam={exam} />
                        </div>
                      )}

                      {/* Subject pills */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {meta.subjects.slice(0, 3).map((s) => (
                          <span key={s.key} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-navy-600 rounded-full">
                            {s.icon} {s.label}
                          </span>
                        ))}
                        {meta.subjects.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-navy-400 rounded-full">
                            +{meta.subjects.length - 3}
                          </span>
                        )}
                      </div>

                      {/* CTAs */}
                      <div className="mt-auto space-y-2">
                        <Link
                          to={`/prep/${exam}/session`}
                          state={{ mode: "diagnostic", exam }}
                          className={`block w-full text-center py-3 rounded-2xl font-bold text-sm transition-all ${
                            started
                              ? "bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 hover:from-navy-800 hover:to-navy-900"
                              : `bg-gradient-to-r ${meta.color} text-white shadow-md`
                          }`}
                        >
                          {started ? "📚 Continuer" : "🎯 Commencer"}
                        </Link>
                        {started && (
                          <Link
                            to={`/prep/${exam}/session`}
                            state={{ mode: "exam", exam }}
                            className="block w-full text-center py-2.5 rounded-2xl border border-gray-200 text-navy-600 font-semibold text-xs hover:bg-gray-50 transition-all"
                          >
                            ⏱️ Simulation examen
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Feature highlights */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🎯", title: "Questions réelles 2025", desc: "Basées sur les sujets officiels des concours marocains" },
              { icon: "💡", title: "Explications détaillées", desc: "Chaque réponse explique l'erreur classique et la méthode correcte" },
              { icon: "⏱️", title: "Simulation chronométrée", desc: "Mode examen identique au vrai concours avec décompte en temps réel" },
            ].map((f) => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="text-white font-bold text-sm mb-1">{f.title}</div>
                <div className="text-navy-400 text-xs leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-navy-600 text-xs mt-6">
            🛡️ Données anonymes · Progression sauvegardée localement · Conforme CNDP
          </p>
        </div>
      </div>
    </>
  );
}
