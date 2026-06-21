import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  EXAM_META, QUESTIONS, type Exam, type PrepQuestion,
  getDiagnosticQuestions, getMockExamQuestions, SUBJECT_XP_VALUES,
  getQuestionsBySubject,
} from "../data/prepQuestions";
import { usePrepStore } from "../stores/prepStore";

type Mode = "diagnostic" | "train" | "exam";
type Screen = "mode-select" | "subject-select" | "session" | "results" | "exam-review";

interface SessionConfig {
  mode: Mode;
  exam: Exam;
  subject?: string;
}

// ── Timer hook ───────────────────────────────────────────────────────────────
function useTimer(totalSeconds: number, running: boolean) {
  const [remaining, setRemaining] = useState(totalSeconds);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return { remaining, display: `${mm}:${ss}`, pct: Math.round((remaining / totalSeconds) * 100), isUrgent: remaining < 300 };
}

// ── Formula display ───────────────────────────────────────────────────────────
// Questions already use Unicode (CO₂, e⁻, α, etc.) — just apply formula styling
function QuestionText({ text }: { text: string }) {
  return (
    <p className="text-navy-800 font-semibold text-[15px] leading-relaxed">
      {text}
    </p>
  );
}

// ── Mode selector screen ──────────────────────────────────────────────────────
function ModeSelector({ exam, onSelect }: { exam: Exam; onSelect: (mode: Mode) => void }) {
  const meta = EXAM_META[exam];
  const totalQ = QUESTIONS.filter(q => q.exam === exam).length;

  return (
    <div className="max-w-xl mx-auto px-4 pt-6 pb-16">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${meta.color} text-white rounded-2xl font-bold text-sm mb-3`}>
          <span>{meta.icon}</span> {meta.label}
        </div>
        <h2 className="font-heading text-2xl font-bold text-white mb-1">Quel mode ?</h2>
        <p className="text-navy-400 text-sm">{totalQ} questions disponibles</p>
      </div>

      <div className="space-y-3">
        {/* Diagnostic */}
        <button
          type="button"
          onClick={() => onSelect("diagnostic")}
          className="w-full bg-white rounded-2xl p-5 text-left hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">🎯</div>
            <div className="flex-1 min-w-0">
              <div className="font-heading font-bold text-navy-800">Diagnostic rapide</div>
              <div className="text-navy-500 text-sm mt-0.5">10 questions • Sans chrono • Feedback immédiat</div>
              <div className="text-blue-600 text-xs font-semibold mt-1">Idéal pour commencer — identifie tes points faibles</div>
            </div>
            <svg className="w-5 h-5 text-navy-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </button>

        {/* Train */}
        <button
          type="button"
          onClick={() => onSelect("train")}
          className="w-full bg-white rounded-2xl p-5 text-left hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">📚</div>
            <div className="flex-1 min-w-0">
              <div className="font-heading font-bold text-navy-800">Entraînement par sujet</div>
              <div className="text-navy-500 text-sm mt-0.5">Choisis un thème • 15 questions • Explication après chaque réponse</div>
              <div className="text-emerald-600 text-xs font-semibold mt-1">Renforce les lacunes identifiées au diagnostic</div>
            </div>
            <svg className="w-5 h-5 text-navy-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </button>

        {/* Exam */}
        <button
          type="button"
          onClick={() => onSelect("exam")}
          className="w-full bg-white rounded-2xl p-5 text-left hover:shadow-lg transition-all group border-2 border-rose-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border-2 border-rose-100 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">⏱️</div>
            <div className="flex-1 min-w-0">
              <div className="font-heading font-bold text-navy-800 flex items-center gap-2">
                Simulation examen complet
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded-full">CHRONO</span>
              </div>
              <div className="text-navy-500 text-sm mt-0.5">Toutes les questions • {meta.duration} • Résultats à la fin seulement</div>
              <div className="text-rose-600 text-xs font-semibold mt-1">Reproduit exactement les conditions du vrai concours</div>
            </div>
            <svg className="w-5 h-5 text-navy-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </button>
      </div>

      <Link to="/prep" className="block text-center text-navy-500 text-sm mt-5 hover:text-white transition-colors">
        ← Retour aux concours
      </Link>
    </div>
  );
}

// ── Subject selector screen ───────────────────────────────────────────────────
function SubjectSelector({ exam, onSelect }: { exam: Exam; onSelect: (subject: string) => void }) {
  const meta = EXAM_META[exam];

  return (
    <div className="max-w-xl mx-auto px-4 pt-6 pb-16">
      <div className="text-center mb-6">
        <h2 className="font-heading text-2xl font-bold text-white mb-1">Quel sujet ?</h2>
        <p className="text-navy-400 text-sm">Entraînement ciblé sur un thème précis</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {meta.subjects.map((s) => {
          const count = getQuestionsBySubject(exam, s.key).length;
          if (count === 0) return null;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect(s.key)}
              className="bg-white rounded-2xl p-4 text-left hover:shadow-md transition-all group border-2 border-transparent hover:border-gold-200"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">{s.icon}</div>
              <div className="font-bold text-navy-800 text-sm leading-tight">{s.label}</div>
              <div className="text-navy-400 text-[11px] mt-1">{count} question{count > 1 ? "s" : ""}</div>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => history.back()}
        className="block w-full text-center text-navy-500 text-sm mt-5 hover:text-white transition-colors"
      >
        ← Retour
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PrepSession() {
  const location = useLocation();
  const config = location.state as SessionConfig | null;

  const { addResult, markDiagnosticDone, incrementSession, updateStreak, getSubjectMastery } = usePrepStore();

  const [screen, setScreen] = useState<Screen>(
    config?.mode ? (config.mode === "train" && !config.subject ? "subject-select" : "session") : "mode-select"
  );
  const [activeMode, setActiveMode] = useState<Mode>(config?.mode ?? "diagnostic");
  const [activeSubject, setActiveSubject] = useState<string | undefined>(config?.subject);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Array<{ selected: number; correct: boolean; xp: number }>>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [xpFlash, setXpFlash] = useState<number | null>(null);
  const [examFinished, setExamFinished] = useState(false);

  const exam: Exam = config?.exam ?? "ensa";
  const meta = EXAM_META[exam];

  // Build question list for current session
  const questions: PrepQuestion[] = (() => {
    if (activeMode === "exam") return getMockExamQuestions(exam);
    if (activeMode === "train" && activeSubject) {
      return getQuestionsBySubject(exam, activeSubject)
        .sort(() => Math.random() - 0.5)
        .slice(0, 15);
    }
    return getDiagnosticQuestions(exam, 10);
  })();

  const current = questions[currentIdx];
  const progressPct = Math.round((currentIdx / Math.max(questions.length, 1)) * 100);

  // Exam timer: ENSA/ENA = 90min, ENCG = 150min, FMP = 210min
  const examDurationSeconds = exam === "encg" ? 150 * 60 : exam === "fmp" ? 210 * 60 : 90 * 60;
  const { display: timerDisplay, pct: timerPct, isUrgent } = useTimer(
    examDurationSeconds,
    activeMode === "exam" && screen === "session" && !examFinished
  );

  const handleModeSelect = (mode: Mode) => {
    setActiveMode(mode);
    if (mode === "train") {
      setScreen("subject-select");
    } else {
      setScreen("session");
    }
  };

  const handleSubjectSelect = (subject: string) => {
    setActiveSubject(subject);
    setScreen("session");
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    if (activeMode === "exam") {
      // Exam mode: record answer, no feedback
      const correct = idx === current.correctIndex;
      const xpEarned = correct ? SUBJECT_XP_VALUES[current.level] : 0;
      addResult(exam, current.subject, correct, xpEarned);
      setAnswers((prev) => [...prev, { selected: idx, correct, xp: xpEarned }]);
      setSelected(idx);
      // Auto-advance after 300ms in exam mode
      setTimeout(() => {
        if (currentIdx + 1 >= questions.length) {
          incrementSession(exam);
          updateStreak(exam);
          setExamFinished(true);
          setScreen("exam-review");
        } else {
          setCurrentIdx((i) => i + 1);
          setSelected(null);
        }
      }, 300);
      return;
    }

    // Train/Diagnostic mode: immediate feedback
    setSelected(idx);
    const correct = idx === current.correctIndex;
    const newStreak = correct ? streakCount + 1 : 0;
    setStreakCount(newStreak);
    const baseXP = SUBJECT_XP_VALUES[current.level];
    const streakBonus = correct && newStreak >= 3 ? 5 : 0;
    const xpEarned = correct ? baseXP + streakBonus : 0;
    addResult(exam, current.subject, correct, xpEarned);
    setAnswers((prev) => [...prev, { selected: idx, correct, xp: xpEarned }]);
    if (correct && xpEarned > 0) {
      setXpFlash(xpEarned);
      setTimeout(() => setXpFlash(null), 1500);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      if (activeMode === "diagnostic") markDiagnosticDone(exam);
      incrementSession(exam);
      updateStreak(exam);
      setScreen("results");
      return;
    }
    setCurrentIdx((i) => i + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-navy-400 mb-4">Session introuvable.</p>
          <Link to="/prep" className="text-gold-400 font-bold hover:underline">← Retour</Link>
        </div>
      </div>
    );
  }

  // ── Results screen (diagnostic + train) ──────────────────────────────────
  if (screen === "results") {
    const totalCorrect = answers.filter(a => a.correct).length;
    const totalXP = answers.reduce((s, a) => s + a.xp, 0);
    const accuracy = answers.length > 0 ? Math.round((totalCorrect / answers.length) * 100) : 0;
    const emoji = accuracy >= 70 ? "🎉" : accuracy >= 50 ? "💪" : "📖";
    const label = accuracy >= 70 ? "Excellent !" : accuracy >= 50 ? "Bien joué !" : "Continue l'entraînement";

    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{emoji}</div>
            <h2 className="font-heading text-2xl font-bold text-navy-800 mb-1">{label}</h2>
            <p className="text-navy-400 text-sm">
              {activeMode === "diagnostic" ? "Diagnostic terminé" : activeSubject ? `Entraînement — ${meta.subjects.find(s => s.key === activeSubject)?.label}` : "Session terminée"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-emerald-50 rounded-2xl p-3 text-center">
              <div className="font-heading font-black text-2xl text-emerald-600">{accuracy}%</div>
              <div className="text-xs text-emerald-700 mt-0.5">Score</div>
            </div>
            <div className="bg-gold-50 rounded-2xl p-3 text-center">
              <div className="font-heading font-black text-2xl text-gold-600">+{totalXP}</div>
              <div className="text-xs text-gold-700 mt-0.5">XP</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-3 text-center">
              <div className="font-heading font-black text-2xl text-blue-600">{totalCorrect}/{answers.length}</div>
              <div className="text-xs text-blue-700 mt-0.5">Bonnes</div>
            </div>
          </div>

          {/* Subject breakdown */}
          {activeMode === "diagnostic" && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-5">
              <div className="text-xs font-bold text-amber-800 mb-2">📊 Maîtrise par sujet :</div>
              <div className="space-y-1.5">
                {meta.subjects.slice(0, 5).map((s) => {
                  const m = getSubjectMastery(exam, s.key);
                  if (m === 0) return null;
                  return (
                    <div key={s.key} className="flex items-center gap-2">
                      <span className="text-xs text-navy-600 w-28 truncate flex-shrink-0">{s.icon} {s.label}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${m >= 70 ? "bg-emerald-400" : m >= 40 ? "bg-amber-400" : "bg-rose-400"}`} style={{ width: `${m}%` }} />
                      </div>
                      <span className="text-[10px] text-navy-500 w-7 text-right">{m}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Link
              to={`/prep/${exam}/session`}
              state={{ mode: "train", exam }}
              className="block w-full text-center py-3.5 rounded-2xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold text-sm hover:from-navy-800 hover:to-navy-900 transition-all"
            >
              📚 Entraîner par sujet
            </Link>
            <Link
              to={`/prep/${exam}/session`}
              state={{ mode: "exam", exam }}
              className="block w-full text-center py-3 rounded-2xl border border-rose-200 text-rose-700 font-bold text-sm hover:bg-rose-50 transition-all"
            >
              ⏱️ Simulation examen complet
            </Link>
            <Link to="/prep" className="block w-full text-center py-2.5 text-navy-400 text-sm hover:text-navy-600 transition-colors">
              ← Tous les concours
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Exam review screen ────────────────────────────────────────────────────
  if (screen === "exam-review") {
    const totalCorrect = answers.filter(a => a.correct).length;
    const accuracy = answers.length > 0 ? Math.round((totalCorrect / answers.length) * 100) : 0;
    const note = accuracy >= 85 ? "A" : accuracy >= 70 ? "B" : accuracy >= 55 ? "C" : accuracy >= 40 ? "D" : "E";
    const noteColor = accuracy >= 70 ? "text-emerald-600" : accuracy >= 55 ? "text-amber-600" : "text-rose-600";

    return (
      <div className="min-h-screen bg-navy-950 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-4">
            {/* Header */}
            <div className={`bg-gradient-to-r ${meta.color} px-6 py-5 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-heading font-bold text-lg">{meta.label} — Résultats</div>
                  <div className="text-white/70 text-sm">{questions.length} questions · Simulation examen</div>
                </div>
                <div className="text-right">
                  <div className={`font-heading font-black text-4xl ${noteColor.replace("text-", "text-white")}`}>{note}</div>
                  <div className="text-white/70 text-xs">{accuracy}%</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-emerald-50 rounded-2xl p-3 text-center">
                  <div className="font-heading font-black text-2xl text-emerald-600">{accuracy}%</div>
                  <div className="text-xs text-emerald-700">Score</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-3 text-center">
                  <div className="font-heading font-black text-2xl text-blue-600">{totalCorrect}/{answers.length}</div>
                  <div className="text-xs text-blue-700">Bonnes</div>
                </div>
                <div className="bg-rose-50 rounded-2xl p-3 text-center">
                  <div className="font-heading font-black text-2xl text-rose-600">{answers.length - totalCorrect}</div>
                  <div className="text-xs text-rose-700">Erreurs</div>
                </div>
              </div>

              {/* Answers review */}
              <div className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-3">Révision des réponses</div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {questions.map((q, i) => {
                  const ans = answers[i];
                  if (!ans) return null;
                  return (
                    <div key={q.id} className={`flex items-start gap-3 p-3 rounded-xl border ${ans.correct ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"}`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ans.correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                        {ans.correct ? "✓" : "✗"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-navy-700 font-medium line-clamp-1">{q.question}</div>
                        {!ans.correct && (
                          <div className="text-[10px] text-rose-600 mt-0.5">
                            Correct : {q.options[q.correctIndex]}
                          </div>
                        )}
                        {!ans.correct && (
                          <div className="text-[10px] text-navy-500 mt-1 leading-tight line-clamp-2">{q.explanation}</div>
                        )}
                      </div>
                      <span className="text-[10px] text-navy-400 flex-shrink-0 font-bold">{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              to={`/prep/${exam}/session`}
              state={{ mode: "exam", exam }}
              className="block w-full text-center py-3.5 rounded-2xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold text-sm hover:from-navy-800 hover:to-navy-900 transition-all"
            >
              🔄 Recommencer la simulation
            </Link>
            <Link to="/prep" className="block w-full text-center py-2.5 text-navy-400 text-sm hover:text-white transition-colors">
              ← Tous les concours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Mode/Subject selectors ────────────────────────────────────────────────
  if (screen === "mode-select") {
    return (
      <div className="min-h-screen bg-navy-950">
        <ModeSelector exam={exam} onSelect={handleModeSelect} />
      </div>
    );
  }

  if (screen === "subject-select") {
    return (
      <div className="min-h-screen bg-navy-950">
        <SubjectSelector exam={exam} onSelect={handleSubjectSelect} />
      </div>
    );
  }

  // ── Question screen ───────────────────────────────────────────────────────
  if (!current) return null;
  const isExamMode = activeMode === "exam";

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      {/* Top bar */}
      <div className="px-4 pt-4 pb-3 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/prep" className="text-white/40 hover:text-white text-sm transition-colors flex-shrink-0 leading-none">←</Link>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/50">
                {currentIdx + 1} / {questions.length}
                {isExamMode && (
                  <span className={`ml-3 font-bold font-heading text-sm ${isUrgent ? "text-rose-400 animate-pulse" : "text-gold-300"}`}>
                    ⏱ {timerDisplay}
                  </span>
                )}
              </span>
              {!isExamMode && streakCount >= 2 && (
                <span className="text-xs font-bold text-amber-400">🔥 {streakCount}</span>
              )}
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            {isExamMode && (
              <div className="h-0.5 bg-white/5 rounded-full overflow-hidden mt-0.5">
                <div className={`h-full rounded-full ${isUrgent ? "bg-rose-500" : "bg-blue-500/40"}`} style={{ width: `${100 - timerPct}%` }} />
              </div>
            )}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
            isExamMode ? "bg-rose-500/20 text-rose-300" :
            activeMode === "diagnostic" ? "bg-blue-500/20 text-blue-300" :
            "bg-emerald-500/20 text-emerald-300"
          }`}>
            {isExamMode ? "EXAM" : activeMode === "diagnostic" ? "Diag." : "Train."}
          </span>
        </div>
      </div>

      {/* XP flash */}
      <AnimatePresence>
        {xpFlash !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gold-500 text-navy-900 font-black text-lg px-5 py-2 rounded-full shadow-xl pointer-events-none"
          >
            +{xpFlash} XP ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question card */}
      <div className="flex-1 flex items-start justify-center px-4 pt-2 pb-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl shadow-navy-950/50 overflow-hidden"
            >
              {/* Question header */}
              <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 px-2 py-0.5 bg-gray-100 rounded-full">
                    {current.subjectLabel}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    current.level === "facile" ? "bg-emerald-100 text-emerald-700" :
                    current.level === "moyen" ? "bg-amber-100 text-amber-700" :
                    "bg-rose-100 text-rose-700"
                  }`}>
                    {current.level === "facile" ? "⭐" : current.level === "moyen" ? "⭐⭐" : "⭐⭐⭐"}
                  </span>
                  {current.source && <span className="text-[10px] text-navy-300 ml-auto">{current.source}</span>}
                </div>

                <QuestionText text={current.question} />

                {current.tip && !showExplanation && !isExamMode && (
                  <div className="mt-3 flex items-start gap-2 text-[11px] text-gold-800 bg-gold-50 border border-gold-200 rounded-xl px-3 py-2">
                    <span className="flex-shrink-0 text-gold-600">💡</span>
                    <span>{current.tip}</span>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="px-5 py-4 space-y-2.5">
                {current.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === current.correctIndex;
                  const revealed = selected !== null && !isExamMode;

                  let style = "border-gray-200 bg-white hover:border-navy-300 hover:bg-navy-50 cursor-pointer";
                  if (revealed) {
                    if (isCorrect) style = "border-emerald-400 bg-emerald-50 cursor-default";
                    else if (isSelected) style = "border-rose-400 bg-rose-50 cursor-default";
                    else style = "border-gray-100 bg-gray-50 opacity-40 cursor-default";
                  }
                  if (isExamMode && isSelected) style = "border-navy-400 bg-navy-50 cursor-default";

                  return (
                    <motion.button
                      key={i}
                      type="button"
                      whileTap={(revealed || (isExamMode && selected !== null)) ? {} : { scale: 0.98 }}
                      onClick={() => handleSelect(i)}
                      disabled={selected !== null}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-200 min-h-[52px] ${style}`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 transition-colors ${
                        revealed
                          ? isCorrect ? "bg-emerald-500 border-emerald-500 text-white"
                          : isSelected ? "bg-rose-500 border-rose-500 text-white"
                          : "border-gray-300 text-gray-400"
                          : isExamMode && isSelected ? "bg-navy-700 border-navy-700 text-white"
                          : "border-gray-300 text-gray-500"
                      }`}>
                        {revealed && isCorrect ? "✓" : revealed && isSelected ? "✗" : String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm text-navy-700 leading-snug font-medium">{opt}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation (train/diagnostic only) */}
              <AnimatePresence>
                {showExplanation && !isExamMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`mx-5 mb-4 p-4 rounded-2xl border ${
                      selected === current.correctIndex
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-rose-50 border-rose-200"
                    }`}>
                      <div className="flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">
                          {selected === current.correctIndex ? "✅" : "❌"}
                        </span>
                        <div>
                          {selected !== current.correctIndex && (
                            <div className="text-xs font-bold text-rose-700 mb-1">
                              Bonne réponse : {current.options[current.correctIndex]}
                            </div>
                          )}
                          <p className="text-xs text-navy-700 leading-relaxed">{current.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button (train/diagnostic) */}
              {showExplanation && !isExamMode && (
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold text-sm hover:from-navy-800 hover:to-navy-900 transition-all shadow-lg"
                  >
                    {currentIdx + 1 >= questions.length ? "Voir les résultats →" : "Question suivante →"}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
