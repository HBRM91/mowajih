import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  EXAM_META, QUESTIONS, type Exam, type PrepQuestion,
  getDiagnosticQuestions, getMockExamQuestions, SUBJECT_XP_VALUES,
} from "../data/prepQuestions";
import { usePrepStore } from "../stores/prepStore";

type Mode = "diagnostic" | "train" | "exam";

interface SessionConfig {
  mode: Mode;
  exam: Exam;
  subject?: string;
}

// Timer hook for exam mode
function useTimer(durationSeconds: number, running: boolean) {
  const [remaining, setRemaining] = useState(durationSeconds);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return { remaining, display: `${mm}:${ss}`, isUrgent: remaining < 300 };
}

export default function PrepSession() {
  const location = useLocation();
  const config = location.state as SessionConfig | null;

  const { addResult, markDiagnosticDone, incrementSession, updateStreak, getSubjectMastery } = usePrepStore();

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-navy-600 mb-4">Session invalide.</p>
          <Link to="/prep" className="text-gold-700 font-bold hover:underline">← Retour à la préparation</Link>
        </div>
      </div>
    );
  }

  const { mode, exam, subject } = config;
  const meta = EXAM_META[exam];

  // Build question list
  const questions: PrepQuestion[] = (() => {
    if (mode === "diagnostic") return getDiagnosticQuestions(exam, 10);
    if (mode === "exam") return getMockExamQuestions(exam);
    if (mode === "train" && subject) {
      const bySubject = QUESTIONS.filter(q => q.exam === exam && q.subject === subject);
      return bySubject.sort(() => Math.random() - 0.5).slice(0, 15);
    }
    return getDiagnosticQuestions(exam, 10);
  })();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionResults, setSessionResults] = useState<Array<{ correct: boolean; xp: number }>>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [xpFlash, setXpFlash] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const current = questions[currentIdx];
  const progress = Math.round(((currentIdx) / questions.length) * 100);

  // Timer (exam mode only — 90 min per ENSA/ENA paper, 150 min for ENCG)
  const examDuration = exam === "encg" ? 150 * 60 : 90 * 60;
  const { display: timerDisplay, isUrgent } = useTimer(examDuration, mode === "exam" && !done);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === current.correctIndex;
    const baseXP = SUBJECT_XP_VALUES[current.level];
    const streakBonus = correct && streakCount >= 2 ? 5 : 0;
    const xpEarned = correct ? baseXP + streakBonus : 0;

    const newStreak = correct ? streakCount + 1 : 0;
    setStreakCount(newStreak);

    addResult(exam, current.subject, correct, xpEarned);
    setSessionResults((prev) => [...prev, { correct, xp: xpEarned }]);

    if (correct && xpEarned > 0) {
      setXpFlash(xpEarned);
      setTimeout(() => setXpFlash(null), 1500);
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      if (mode === "diagnostic") markDiagnosticDone(exam);
      incrementSession(exam);
      updateStreak(exam);
      setDone(true);
      return;
    }
    setCurrentIdx((i) => i + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  if (done) {
    const totalCorrect = sessionResults.filter(r => r.correct).length;
    const totalXP = sessionResults.reduce((a, r) => a + r.xp, 0);
    const accuracy = Math.round((totalCorrect / sessionResults.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-800 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          <div className="text-6xl mb-4">{accuracy >= 70 ? "🎉" : accuracy >= 50 ? "💪" : "📚"}</div>
          <h2 className="font-heading text-2xl font-bold text-navy-800 mb-1">
            {accuracy >= 70 ? "Excellent !" : accuracy >= 50 ? "Bien joué !" : "Continue l'effort !"}
          </h2>
          <p className="text-navy-500 text-sm mb-6">
            {mode === "diagnostic" ? "Diagnostic terminé" : mode === "exam" ? "Simulation terminée" : "Entraînement terminé"}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-emerald-50 rounded-2xl p-3">
              <div className="font-heading font-black text-2xl text-emerald-600">{accuracy}%</div>
              <div className="text-xs text-emerald-700 mt-0.5">Score</div>
            </div>
            <div className="bg-gold-50 rounded-2xl p-3">
              <div className="font-heading font-black text-2xl text-gold-600">+{totalXP}</div>
              <div className="text-xs text-gold-700 mt-0.5">XP gagnés</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-3">
              <div className="font-heading font-black text-2xl text-blue-600">{totalCorrect}/{questions.length}</div>
              <div className="text-xs text-blue-700 mt-0.5">Bonnes rép.</div>
            </div>
          </div>

          {accuracy < 70 && mode === "diagnostic" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
              <div className="text-xs font-bold text-amber-800 mb-2">📌 Points à renforcer :</div>
              {meta.subjects.slice(0, 3).map((s) => {
                const mastery = getSubjectMastery(exam, s.key);
                return (
                  <div key={s.key} className="flex items-center justify-between py-1">
                    <span className="text-xs text-navy-700">{s.icon} {s.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${mastery >= 70 ? "bg-emerald-400" : mastery >= 40 ? "bg-amber-400" : "bg-rose-400"}`}
                          style={{ width: `${mastery}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-navy-500 w-8">{mastery}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="space-y-2">
            <Link
              to={`/prep/${exam}/session`}
              state={{ mode: "diagnostic", exam }}
              className="block w-full py-3.5 rounded-2xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold text-sm text-center hover:from-navy-800 hover:to-navy-900 transition-all"
            >
              📚 Continuer l'entraînement
            </Link>
            <Link
              to="/prep"
              className="block w-full py-3 rounded-2xl border border-gray-200 text-navy-600 font-semibold text-sm text-center hover:bg-gray-50 transition-all"
            >
              ← Retour aux concours
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-800 flex flex-col">
      {/* Top bar */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3 max-w-xl mx-auto w-full">
        <Link to="/prep" className="text-white/50 hover:text-white text-sm transition-colors flex-shrink-0">
          ←
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/50 font-medium">
              {currentIdx + 1} / {questions.length}
              {mode === "exam" && <span className={`ml-3 font-bold ${isUrgent ? "text-rose-400 animate-pulse" : "text-gold-300"}`}>⏱ {timerDisplay}</span>}
            </span>
            {streakCount >= 2 && (
              <span className="text-xs font-bold text-amber-400">🔥 {streakCount} de suite</span>
            )}
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
          mode === "diagnostic" ? "bg-blue-500/20 text-blue-300" :
          mode === "exam" ? "bg-rose-500/20 text-rose-300" :
          "bg-emerald-500/20 text-emerald-300"
        }`}>
          {mode === "diagnostic" ? "Diagnostic" : mode === "exam" ? "Exam" : "Entraîn."}
        </span>
      </div>

      {/* XP flash */}
      <AnimatePresence>
        {xpFlash !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gold-500 text-navy-900 font-black text-lg px-5 py-2 rounded-full shadow-xl"
          >
            +{xpFlash} XP ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question card */}
      <div className="flex-1 flex items-start justify-center px-4 pt-4 pb-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl shadow-navy-950/40 overflow-hidden"
            >
              {/* Question header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 px-2 py-0.5 bg-gray-100 rounded-full">
                    {current.subjectLabel}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    current.level === "facile" ? "bg-emerald-100 text-emerald-700" :
                    current.level === "moyen" ? "bg-amber-100 text-amber-700" :
                    "bg-rose-100 text-rose-700"
                  }`}>
                    {current.level === "facile" ? "Facile" : current.level === "moyen" ? "Moyen" : "Difficile"}
                  </span>
                  {current.source && (
                    <span className="text-[10px] text-navy-300 ml-auto">{current.source}</span>
                  )}
                </div>
                <p className="text-navy-800 font-semibold text-base leading-relaxed">
                  {current.question}
                </p>
                {current.tip && !showExplanation && (
                  <p className="text-[11px] text-gold-700 bg-gold-50 border border-gold-200 rounded-lg px-3 py-2 mt-3 flex items-start gap-2">
                    <span className="flex-shrink-0">💡</span>
                    <span>{current.tip}</span>
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="px-6 py-4 space-y-2.5">
                {current.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === current.correctIndex;
                  const revealed = selected !== null;

                  let style = "border-gray-200 bg-white hover:border-navy-300 hover:bg-navy-50 cursor-pointer";
                  if (revealed) {
                    if (isCorrect) style = "border-emerald-400 bg-emerald-50 cursor-default";
                    else if (isSelected) style = "border-rose-400 bg-rose-50 cursor-default";
                    else style = "border-gray-100 bg-gray-50 opacity-50 cursor-default";
                  }

                  return (
                    <motion.button
                      key={i}
                      type="button"
                      whileTap={revealed ? {} : { scale: 0.98 }}
                      onClick={() => handleSelect(i)}
                      disabled={revealed}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-200 min-h-[52px] ${style}`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border-2 ${
                        revealed
                          ? isCorrect ? "bg-emerald-500 border-emerald-500 text-white"
                          : isSelected ? "bg-rose-500 border-rose-500 text-white"
                          : "border-gray-300 text-gray-400"
                          : "border-gray-300 text-gray-500"
                      }`}>
                        {revealed && isCorrect ? "✓" : revealed && isSelected ? "✗" : String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm text-navy-700 leading-snug">{opt}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`mx-6 mb-4 p-4 rounded-2xl border ${
                      selected === current.correctIndex
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-rose-50 border-rose-200"
                    }`}>
                      <div className="flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">
                          {selected === current.correctIndex ? "✅" : "❌"}
                        </span>
                        <div>
                          <div className={`text-xs font-bold mb-1 ${selected === current.correctIndex ? "text-emerald-700" : "text-rose-700"}`}>
                            {selected === current.correctIndex ? "Bonne réponse !" : `Mauvaise réponse — La bonne était : ${current.options[current.correctIndex]}`}
                          </div>
                          <p className="text-xs text-navy-600 leading-relaxed">{current.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button */}
              {showExplanation && (
                <div className="px-6 pb-6">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold text-base hover:from-navy-800 hover:to-navy-900 transition-all shadow-lg"
                  >
                    {currentIdx + 1 >= questions.length ? "Voir les résultats →" : "Question suivante →"}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Subject quick-train shortcuts (training mode) */}
          {mode === "diagnostic" && !showExplanation && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {meta.subjects.slice(0, 4).map((s) => (
                <Link
                  key={s.key}
                  to={`/prep/${exam}/session`}
                  state={{ mode: "train", exam, subject: s.key }}
                  className="flex items-center gap-2 px-3 py-2 bg-white/8 border border-white/15 rounded-xl text-white/60 text-xs hover:bg-white/15 hover:text-white transition-all"
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
