import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  EXAM_META, QUESTIONS, type Exam, type PrepQuestion, type Level,
  SUBJECT_XP_VALUES,
} from "../data/prepQuestions";
import { usePrepStore } from "../stores/prepStore";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RouteState { exam: Exam; mode?: "exam" | "train"; subject?: string }

interface SessionSetup {
  exam: Exam;
  questionCount: number;
  subjects: string[];        // empty = all subjects
  difficulty: Level | "all";
  mode: "train" | "exam";
  useTimer: boolean;
}

interface Answer {
  qIdx: number;
  selectedIdx: number | null;
  correct: boolean;
  xp: number;
  secondsSpent: number;
  flagged: boolean;
}

type Screen = "config" | "session" | "results";

const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 30] as const;

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useElapsedTimer(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  return elapsed;
}

function useCountdownTimer(totalSec: number, running: boolean) {
  const [remaining, setRemaining] = useState(totalSec);
  useEffect(() => { setRemaining(totalSec); }, [totalSec]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return { remaining, display: `${mm}:${ss}`, pct: Math.round((remaining / totalSec) * 100), urgent: remaining < 300 && remaining > 0, expired: remaining === 0 };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60), s = secs % 60;
  return `${m}min ${s.toString().padStart(2, "0")}s`;
}

function buildQuestions(setup: SessionSetup): PrepQuestion[] {
  let pool = QUESTIONS.filter(q => q.exam === setup.exam);
  if (setup.subjects.length > 0) pool = pool.filter(q => setup.subjects.includes(q.subject));
  if (setup.difficulty !== "all") pool = pool.filter(q => q.level === setup.difficulty);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(setup.questionCount, shuffled.length));
}

function getGrade(pct: number) {
  if (pct >= 90) return { letter: "A+", label: "Excellent", color: "emerald" };
  if (pct >= 80) return { letter: "A",  label: "Très bien", color: "emerald" };
  if (pct >= 70) return { letter: "B",  label: "Bien",      color: "blue" };
  if (pct >= 60) return { letter: "C",  label: "Assez bien",color: "amber" };
  if (pct >= 50) return { letter: "D",  label: "Passable",  color: "orange" };
  return { letter: "E", label: "À revoir", color: "rose" };
}

// ─── Config Screen ───────────────────────────────────────────────────────────

function ConfigScreen({ exam, initialMode, onStart }: {
  exam: Exam;
  initialMode?: "exam" | "train";
  onStart: (setup: SessionSetup) => void;
}) {
  const meta = EXAM_META[exam];
  const allSubjects = meta.subjects.filter(s => QUESTIONS.some(q => q.exam === exam && q.subject === s.key));
  void QUESTIONS; // used via availableCount

  const [mode, setMode] = useState<"train" | "exam">(initialMode ?? "train");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [subjects, setSubjects] = useState<string[]>([]); // empty = all
  const [difficulty, setDifficulty] = useState<Level | "all">("all");
  const [useTimer, setUseTimer] = useState(false);

  const availableCount = (() => {
    let pool = QUESTIONS.filter(q => q.exam === exam);
    if (subjects.length > 0) pool = pool.filter(q => subjects.includes(q.subject));
    if (difficulty !== "all") pool = pool.filter(q => q.level === difficulty);
    return pool.length;
  })();

  const clampedCount = Math.min(questionCount, availableCount);

  const toggleSubject = (key: string) => {
    setSubjects(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleStart = () => {
    onStart({ exam, questionCount: clampedCount, subjects, difficulty, mode, useTimer: mode === "exam" || useTimer });
  };

  const examDuration = exam === "fmp" ? "3h30" : exam === "encg" ? "2h30" : "1h30";

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${meta.color} px-4 py-5`}>
        <div className="max-w-xl mx-auto">
          <Link to="/prep" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1 mb-3">
            ← Tous les concours
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{meta.icon}</span>
            <div>
              <div className="font-heading font-black text-white text-xl">{meta.label}</div>
              <div className="text-white/70 text-xs mt-0.5">{availableCount} questions disponibles · {meta.date}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Config */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-4 py-5 space-y-5">

          {/* Mode */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-bold text-navy-700 mb-3">📝 Mode de session</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: "train", icon: "📚", title: "Entraînement", desc: "Feedback immédiat après chaque réponse" },
                { key: "exam", icon: "⏱️", title: "Examen blanc", desc: `Chrono ${examDuration} · Feedback à la fin seulement` },
              ] as const).map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => { setMode(m.key); if (m.key === "exam") setUseTimer(true); }}
                  className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all ${
                    mode === m.key
                      ? "border-navy-700 bg-navy-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl mb-1">{m.icon}</span>
                  <span className="font-bold text-sm text-navy-800">{m.title}</span>
                  <span className="text-[11px] text-navy-400 leading-tight mt-0.5">{m.desc}</span>
                  {mode === m.key && (
                    <span className="mt-1.5 text-[10px] font-bold text-navy-700 bg-gold-100 px-1.5 py-0.5 rounded-full">Sélectionné ✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Timer toggle for train mode */}
            {mode === "train" && (
              <label className="flex items-center gap-3 mt-3 cursor-pointer">
                <div
                  onClick={() => setUseTimer(v => !v)}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${useTimer ? "bg-navy-700" : "bg-gray-200"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${useTimer ? "left-5" : "left-0.5"}`} />
                </div>
                <span className="text-sm text-navy-600 font-medium">Activer le chronomètre (décompte)</span>
              </label>
            )}
          </div>

          {/* Number of questions */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-navy-700">❓ Nombre de questions</label>
              <span className="text-xs text-navy-400">{availableCount} dispos.</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {QUESTION_COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQuestionCount(n)}
                  disabled={n > availableCount}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                    questionCount === n && n <= availableCount
                      ? "border-navy-700 bg-navy-700 text-white"
                      : n > availableCount
                        ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 text-navy-600 hover:border-navy-300"
                  }`}
                >
                  {n}
                </button>
              ))}
              {availableCount > 30 && (
                <button
                  type="button"
                  onClick={() => setQuestionCount(availableCount)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                    questionCount === availableCount
                      ? "border-navy-700 bg-navy-700 text-white"
                      : "border-gray-200 text-navy-600 hover:border-navy-300"
                  }`}
                >
                  Toutes ({availableCount})
                </button>
              )}
            </div>
          </div>

          {/* Difficulty */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-bold text-navy-700 mb-3">⚡ Difficulté</label>
            <div className="flex gap-2 flex-wrap">
              {([
                { key: "all", label: "Toutes" },
                { key: "facile", label: "⭐ Facile" },
                { key: "moyen", label: "⭐⭐ Moyen" },
                { key: "difficile", label: "⭐⭐⭐ Difficile" },
              ] as const).map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDifficulty(d.key)}
                  className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all ${
                    difficulty === d.key
                      ? "border-navy-700 bg-navy-700 text-white"
                      : "border-gray-200 text-navy-600 hover:border-navy-300"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject selection */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-navy-700">📚 Sujets</label>
              <button
                type="button"
                onClick={() => setSubjects(subjects.length === 0 ? allSubjects.map(s => s.key) : [])}
                className="text-xs text-gold-700 font-bold hover:underline"
              >
                {subjects.length === 0 ? "Sélectionner tout" : "Tout désélectionner"}
              </button>
            </div>
            <p className="text-[11px] text-navy-400 mb-3">Vide = tous les sujets inclus</p>
            <div className="grid grid-cols-2 gap-2">
              {allSubjects.map((s) => {
                const count = QUESTIONS.filter(q => q.exam === exam && q.subject === s.key &&
                  (difficulty === "all" || q.level === difficulty)).length;
                const checked = subjects.includes(s.key);
                return (
                  <label key={s.key} className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    checked ? "border-navy-300 bg-navy-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      checked ? "bg-navy-700 border-navy-700" : "border-gray-300"
                    }`}>
                      {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <input type="checkbox" checked={checked} onChange={() => toggleSubject(s.key)} className="sr-only" />
                    <span className="text-base leading-none">{s.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-navy-700 leading-tight truncate">{s.label}</div>
                      <div className="text-[10px] text-navy-400">{count} q.</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-2.5">
              <span className="text-amber-500 text-lg flex-shrink-0">⚠️</span>
              <div>
                <div className="text-xs font-bold text-amber-800 mb-1">Outil de préparation uniquement</div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Ces questions sont à titre préparatoire. JAD2 TAWJIH n'est affilié à aucun établissement
                  ni à aucun organisme officiel de concours. Les résultats obtenus ici ne garantissent pas
                  le succès au concours officiel. Vérifiez toujours les conditions d'admission sur les
                  sites officiels.
                </p>
              </div>
            </div>
          </div>

          {/* Launch button */}
          <button
            type="button"
            onClick={handleStart}
            disabled={clampedCount === 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold text-base hover:from-navy-800 hover:to-navy-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-navy-900/30"
          >
            {clampedCount === 0
              ? "Aucune question disponible pour ces filtres"
              : `🎯 Lancer — ${clampedCount} question${clampedCount > 1 ? "s" : ""}`
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Session Screen ───────────────────────────────────────────────────────────

function SessionScreen({ setup, questions, onFinish }: {
  setup: SessionSetup;
  questions: PrepQuestion[];
  onFinish: (answers: Answer[], totalElapsed: number) => void;
}) {
  const meta = EXAM_META[setup.exam];
  const examDurationMap: Record<Exam, number> = { ensa: 90*60, ena: 90*60, encg: 150*60, fmp: 210*60 };
  const examDuration = examDurationMap[setup.exam];

  const { addResult } = usePrepStore();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExpl, setShowExpl] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showNavigator, setShowNavigator] = useState(false);
  const [paused, setPaused] = useState(false);
  const [xpFlash, setXpFlash] = useState<number | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const questionStartRef = useRef(Date.now());

  const totalElapsed = useElapsedTimer(!paused && selected === null && !showExpl);
  const countdown = useCountdownTimer(examDuration, setup.useTimer && !paused && !showExpl);

  const current = questions[currentIdx];
  const isExam = setup.mode === "exam";
  const progressPct = Math.round((currentIdx / questions.length) * 100);

  useEffect(() => { questionStartRef.current = Date.now(); }, [currentIdx]);

  // Auto-finish exam when timer expires
  useEffect(() => {
    if (setup.useTimer && countdown.expired && isExam) {
      finishSession();
    }
  }, [countdown.expired]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    const secondsSpent = Math.round((Date.now() - questionStartRef.current) / 1000);
    setSelected(idx);
    const correct = idx === current.correctIndex;
    const newStreak = correct ? streakCount + 1 : 0;
    setStreakCount(newStreak);
    const baseXP = SUBJECT_XP_VALUES[current.level];
    const streakBonus = correct && newStreak >= 3 ? 5 : 0;
    const xpEarned = correct ? baseXP + streakBonus : 0;

    addResult(setup.exam, current.subject, correct, xpEarned);
    const ans: Answer = { qIdx: currentIdx, selectedIdx: idx, correct, xp: xpEarned, secondsSpent, flagged: flagged.has(currentIdx) };
    setAnswers(prev => [...prev, ans]);

    if (!isExam) {
      if (correct && xpEarned > 0) { setXpFlash(xpEarned); setTimeout(() => setXpFlash(null), 1400); }
      setShowExpl(true);
    } else {
      // Exam: auto-advance after 500ms
      setTimeout(() => goToNext([...answers, ans]), 500);
    }
  };

  const goToNext = useCallback((currentAnswers: Answer[]) => {
    if (currentIdx + 1 >= questions.length) {
      finishSession(currentAnswers);
      return;
    }
    setCurrentIdx(i => i + 1);
    setSelected(null);
    setShowExpl(false);
  }, [currentIdx, questions.length]);

  const finishSession = (finalAnswers?: Answer[]) => {
    const { incrementSession, updateStreak } = usePrepStore.getState();
    incrementSession(setup.exam);
    updateStreak(setup.exam);
    onFinish(finalAnswers ?? answers, totalElapsed);
  };

  const handleNext = () => goToNext(answers);

  const jumpTo = (idx: number) => {
    if (isExam) return; // No nav in exam mode
    setCurrentIdx(idx);
    setSelected(null);
    setShowExpl(false);
    setShowNavigator(false);
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentIdx)) next.delete(currentIdx); else next.add(currentIdx);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      {/* Top bar */}
      <div className="bg-navy-900 border-b border-white/8 px-4 py-3">
        <div className="max-w-xl mx-auto">
          {/* Row 1: back + mode + timer */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => { if (window.confirm("Quitter la session ? Ta progression sera perdue.")) finishSession(); }}
              className="text-white/40 hover:text-white text-sm transition-colors flex-shrink-0"
            >✕</button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isExam ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                  {isExam ? "⏱️ EXAMEN" : "📚 ENTRAÎN."}
                </span>
                <span className="text-white/40 text-xs">{meta.label}</span>
                {setup.useTimer && (
                  <span className={`ml-auto font-heading font-bold text-sm flex-shrink-0 ${countdown.urgent ? "text-rose-400 animate-pulse" : "text-gold-300"}`}>
                    {countdown.display}
                  </span>
                )}
              </div>
            </div>
            {/* Pause (train only) */}
            {!isExam && (
              <button onClick={() => setPaused(p => !p)} className="text-white/40 hover:text-white text-xs transition-colors">
                {paused ? "▶ Reprendre" : "⏸"}
              </button>
            )}
            {/* Navigator toggle */}
            {!isExam && (
              <button
                onClick={() => setShowNavigator(v => !v)}
                className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors ${showNavigator ? "bg-gold-500/20 text-gold-300" : "text-white/40 hover:text-white"}`}
              >
                ☰
              </button>
            )}
          </div>
          {/* Row 2: progress */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 flex-shrink-0">{currentIdx + 1}/{questions.length}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {!isExam && streakCount >= 2 && (
              <span className="text-xs text-amber-400 font-bold flex-shrink-0">🔥{streakCount}</span>
            )}
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      {paused && (
        <div className="fixed inset-0 z-50 bg-navy-950/90 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-xs mx-4">
            <div className="text-4xl mb-3">⏸️</div>
            <h3 className="font-heading font-bold text-navy-800 text-xl mb-2">Session en pause</h3>
            <p className="text-navy-400 text-sm mb-5">Prends le temps qu'il te faut.</p>
            <button onClick={() => setPaused(false)} className="w-full py-3 rounded-2xl bg-navy-800 text-gold-200 font-bold hover:bg-navy-900 transition-all">
              ▶ Reprendre
            </button>
          </div>
        </div>
      )}

      {/* XP Flash */}
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

      {/* Navigator panel */}
      <AnimatePresence>
        {showNavigator && !isExam && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-navy-900 border-b border-white/8"
          >
            <div className="max-w-xl mx-auto px-4 py-3">
              <div className="flex flex-wrap gap-1.5">
                {questions.map((_, i) => {
                  const ans = answers.find(a => a.qIdx === i);
                  const isCurrent = i === currentIdx;
                  const isFlagged = flagged.has(i);
                  return (
                    <button
                      key={i}
                      onClick={() => jumpTo(i)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                        isCurrent ? "bg-gold-500 text-navy-900 border-gold-400 scale-110" :
                        ans?.correct ? "bg-emerald-600 text-white border-emerald-500" :
                        ans?.correct === false ? "bg-rose-600 text-white border-rose-500" :
                        "bg-white/10 text-white/60 border-white/10 hover:bg-white/20"
                      } ${isFlagged ? "ring-2 ring-amber-400" : ""}`}
                    >
                      {isFlagged ? "⚑" : i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-2 text-[10px] text-white/40">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> Correct</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-600 inline-block" /> Incorrect</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white/10 inline-block" /> Non répondu</span>
                <span className="flex items-center gap-1 text-amber-400">⚑ Marqué</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question */}
      <div className="flex-1 flex items-start justify-center px-4 pt-4 pb-8">
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
                <div className="flex items-start gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 px-2 py-0.5 bg-gray-100 rounded-full">
                      {current.subjectLabel}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      current.level === "facile" ? "bg-emerald-100 text-emerald-700" :
                      current.level === "moyen" ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    }`}>
                      {"⭐".repeat(current.level === "facile" ? 1 : current.level === "moyen" ? 2 : 3)}
                    </span>
                    {current.source && <span className="text-[10px] text-navy-300">{current.source}</span>}
                  </div>
                  {/* Flag button */}
                  {!isExam && (
                    <button
                      onClick={toggleFlag}
                      className={`flex-shrink-0 text-sm p-1 rounded-lg transition-colors ${flagged.has(currentIdx) ? "text-amber-500 bg-amber-50" : "text-navy-300 hover:text-amber-400"}`}
                      title={flagged.has(currentIdx) ? "Retirer le marqueur" : "Marquer pour révision"}
                    >⚑</button>
                  )}
                </div>

                <p className="text-navy-800 font-semibold text-[15px] leading-relaxed">
                  {current.question}
                </p>

                {current.tip && !showExpl && !isExam && (
                  <div className="mt-3 flex items-start gap-2 text-[11px] text-gold-800 bg-gold-50 border border-gold-200 rounded-xl px-3 py-2">
                    <span className="flex-shrink-0">💡</span>
                    <span>{current.tip}</span>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="px-5 py-4 space-y-2.5">
                {current.options.map((opt, i) => {
                  const isChosen = selected === i;
                  const isCorrect = i === current.correctIndex;
                  const revealed = selected !== null && !isExam;

                  const cls = revealed
                    ? isCorrect ? "border-emerald-400 bg-emerald-50"
                    : isChosen ? "border-rose-400 bg-rose-50"
                    : "border-gray-100 bg-gray-50 opacity-40"
                    : isExam && isChosen ? "border-navy-400 bg-navy-50"
                    : "border-gray-200 bg-white hover:border-navy-300 hover:bg-navy-50 cursor-pointer";

                  return (
                    <motion.button
                      key={i}
                      type="button"
                      whileTap={selected !== null ? {} : { scale: 0.98 }}
                      onClick={() => handleSelect(i)}
                      disabled={selected !== null}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-200 min-h-[52px] ${cls}`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 transition-colors ${
                        revealed && isCorrect ? "bg-emerald-500 border-emerald-500 text-white" :
                        revealed && isChosen ? "bg-rose-500 border-rose-500 text-white" :
                        isExam && isChosen ? "bg-navy-700 border-navy-700 text-white" :
                        "border-gray-300 text-gray-500"
                      }`}>
                        {revealed && isCorrect ? "✓" : revealed && isChosen ? "✗" : String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm text-navy-700 leading-snug font-medium">{opt}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation (train only) */}
              <AnimatePresence>
                {showExpl && !isExam && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className={`mx-5 mb-4 p-4 rounded-2xl border ${selected === current.correctIndex ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                      <div className="flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">{selected === current.correctIndex ? "✅" : "❌"}</span>
                        <div>
                          {selected !== current.correctIndex && (
                            <div className="text-xs font-bold text-rose-700 mb-1.5">
                              ✓ Bonne réponse : {current.options[current.correctIndex]}
                            </div>
                          )}
                          <p className="text-xs text-navy-700 leading-relaxed">{current.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button */}
              {showExpl && !isExam && (
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

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({ setup, questions, answers, totalElapsed, onRetry, onRetryWrong }: {
  setup: SessionSetup;
  questions: PrepQuestion[];
  answers: Answer[];
  totalElapsed: number;
  onRetry: () => void;
  onRetryWrong: () => void;
}) {
  const meta = EXAM_META[setup.exam];
  const correct = answers.filter(a => a.correct).length;
  const accuracy = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;
  const grade = getGrade(accuracy);
  const totalXP = answers.reduce((s, a) => s + a.xp, 0);
  const wrongAnswers = answers.filter(a => !a.correct);
  const flaggedAnswers = answers.filter(a => a.flagged);
  const avgTimePerQ = answers.length > 0 ? Math.round(totalElapsed / answers.length) : 0;

  // Subject breakdown
  const subjectStats = meta.subjects.map(s => {
    const subQs = answers.filter(a => questions[a.qIdx]?.subject === s.key);
    if (subQs.length === 0) return null;
    const subCorrect = subQs.filter(a => a.correct).length;
    const pct = Math.round((subCorrect / subQs.length) * 100);
    return { ...s, correct: subCorrect, total: subQs.length, pct };
  }).filter(Boolean) as Array<{ key: string; label: string; icon: string; correct: number; total: number; pct: number }>;

  const weakSubjects = subjectStats.filter(s => s.pct < 60).sort((a, b) => a.pct - b.pct);
  const printRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    window.print();
  };

  const gradeColorMap: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    amber: "text-amber-600 bg-amber-50 border-amber-200",
    orange: "text-orange-600 bg-orange-50 border-orange-200",
    rose: "text-rose-600 bg-rose-50 border-rose-200",
  };

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          .print-report { display: block !important; position: fixed; inset: 0; background: white; overflow: auto; padding: 20px; }
          .no-print { display: none !important; }
        }
        @media screen { .print-report { display: contents; } }
      `}</style>

      <div className="min-h-screen bg-navy-950 px-4 py-6" ref={printRef}>
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Score card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className={`bg-gradient-to-r ${meta.color} px-6 py-5 text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-white/70 uppercase tracking-wider">Rapport de session</div>
                  <div className="font-heading font-black text-2xl mt-0.5">{meta.label}</div>
                  <div className="text-white/70 text-sm mt-1">
                    {setup.mode === "exam" ? "Simulation examen" : `Entraînement — ${questions.length} questions`}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 font-heading font-black text-3xl ${gradeColorMap[grade.color]}`}>
                    {grade.letter}
                  </div>
                  <div className="text-white/70 text-xs mt-1">{grade.label}</div>
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                <div className="text-center">
                  <div className={`font-heading font-black text-2xl ${accuracy >= 70 ? "text-emerald-600" : accuracy >= 50 ? "text-amber-600" : "text-rose-600"}`}>{accuracy}%</div>
                  <div className="text-[10px] text-navy-400 font-semibold">Score</div>
                </div>
                <div className="text-center">
                  <div className="font-heading font-black text-2xl text-navy-800">{correct}/{answers.length}</div>
                  <div className="text-[10px] text-navy-400 font-semibold">Bonnes rép.</div>
                </div>
                <div className="text-center">
                  <div className="font-heading font-black text-2xl text-gold-600">+{totalXP}</div>
                  <div className="text-[10px] text-navy-400 font-semibold">XP gagnés</div>
                </div>
                <div className="text-center">
                  <div className="font-heading font-black text-xl text-navy-800">{formatTime(totalElapsed)}</div>
                  <div className="text-[10px] text-navy-400 font-semibold">Durée</div>
                </div>
              </div>

              {/* Overall progress bar */}
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-navy-500">Score global</span>
                <span className={`font-bold ${accuracy >= 70 ? "text-emerald-600" : accuracy >= 50 ? "text-amber-600" : "text-rose-600"}`}>{accuracy}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
                <motion.div
                  className={`h-full rounded-full ${accuracy >= 70 ? "bg-emerald-500" : accuracy >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${accuracy}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              {/* Subject breakdown */}
              {subjectStats.length > 0 && (
                <div className="mb-5">
                  <div className="text-sm font-bold text-navy-700 mb-3">📊 Performance par sujet</div>
                  <div className="space-y-2.5">
                    {subjectStats.map(s => (
                      <div key={s.key}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span>{s.icon}</span>
                            <span className="text-xs font-semibold text-navy-700">{s.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-navy-400">{s.correct}/{s.total}</span>
                            <span className={`text-xs font-bold ${s.pct >= 70 ? "text-emerald-600" : s.pct >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                              {s.pct}%
                            </span>
                            <span className="text-sm">{s.pct >= 70 ? "✅" : s.pct >= 50 ? "⚠️" : "❌"}</span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${s.pct >= 70 ? "bg-emerald-400" : s.pct >= 50 ? "bg-amber-400" : "bg-rose-400"}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${s.pct}%` }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {weakSubjects.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
                  <div className="text-sm font-bold text-amber-800 mb-2">🎯 À améliorer en priorité</div>
                  <div className="space-y-1.5">
                    {weakSubjects.map(s => (
                      <div key={s.key} className="flex items-center gap-2">
                        <span>{s.icon}</span>
                        <span className="text-xs text-amber-800 font-medium flex-1">{s.label}</span>
                        <span className="text-xs text-amber-600 font-bold">{s.pct}%</span>
                        <span className="text-[10px] text-amber-600">
                          {s.pct < 40 ? "⚠️ Révision urgente" : "📈 À renforcer"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-700 mt-2 leading-relaxed">
                    Utilise le mode "Entraînement par sujet" pour cibler ces chapitres spécifiquement.
                  </p>
                </div>
              )}

              {/* Time analysis */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
                <div className="text-xs font-bold text-blue-700 mb-2">⏱️ Analyse du temps</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-navy-500">Durée totale :</span> <span className="font-bold text-navy-700">{formatTime(totalElapsed)}</span></div>
                  <div><span className="text-navy-500">Temps/question :</span> <span className="font-bold text-navy-700">{formatTime(avgTimePerQ)}</span></div>
                  {setup.mode === "exam" && (
                    <div className="col-span-2">
                      <span className="text-navy-500">Objectif concours : </span>
                      <span className="font-bold text-navy-700">
                        {setup.exam === "fmp" ? "~5 min/question" : setup.exam === "encg" ? "~1,5 min/question" : "~4,5 min/question"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Wrong questions review */}
              {wrongAnswers.length > 0 && (
                <div className="mb-5">
                  <div className="text-sm font-bold text-navy-700 mb-3">❌ Questions incorrectes ({wrongAnswers.length})</div>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {wrongAnswers.map(a => {
                      const q = questions[a.qIdx];
                      if (!q) return null;
                      return (
                        <div key={a.qIdx} className="bg-rose-50 border border-rose-100 rounded-xl p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded-full flex-shrink-0">Q{a.qIdx + 1}</span>
                            <p className="text-xs text-navy-700 font-medium leading-snug line-clamp-2">{q.question}</p>
                          </div>
                          <div className="text-[11px] text-rose-600 mb-1">
                            Ta réponse : <span className="font-bold">{a.selectedIdx !== null ? q.options[a.selectedIdx] : "Non répondu"}</span>
                          </div>
                          <div className="text-[11px] text-emerald-700 mb-1.5">
                            ✓ Bonne réponse : <span className="font-bold">{q.options[q.correctIndex]}</span>
                          </div>
                          <div className="text-[10px] text-navy-500 leading-relaxed bg-white/70 rounded-lg px-2 py-1.5">
                            {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Flagged for review */}
              {flaggedAnswers.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 mb-5">
                  <div className="text-xs font-bold text-amber-700 mb-1">⚑ Questions marquées pour révision ({flaggedAnswers.length})</div>
                  <div className="flex flex-wrap gap-1">
                    {flaggedAnswers.map(a => (
                      <span key={a.qIdx} className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${a.correct ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        Q{a.qIdx + 1}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 mb-5">
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  ⚠️ Ces résultats sont à titre de préparation uniquement. JAD2 TAWJIH n'est affilié à aucun établissement ni organisme officiel.
                  Les performances obtenues ici ne garantissent pas le succès au concours officiel. Continuez à travailler avec les ressources officielles.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5 no-print">
            {wrongAnswers.length > 0 && (
              <button
                onClick={onRetryWrong}
                className="w-full py-3.5 rounded-2xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-all shadow-md"
              >
                🔄 Réessayer les {wrongAnswers.length} questions incorrectes
              </button>
            )}
            <button
              onClick={onRetry}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 font-bold text-sm hover:from-navy-800 hover:to-navy-900 transition-all"
            >
              ✨ Nouvelle session
            </button>
            <button
              onClick={handleExport}
              className="w-full py-3 rounded-2xl border border-gray-300 text-navy-600 font-semibold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Exporter / Imprimer le rapport
            </button>
            <Link to="/prep" className="block w-full text-center py-2.5 text-navy-400 text-sm hover:text-white transition-colors">
              ← Tous les concours
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PrepSession() {
  const location = useLocation();
  const routeState = location.state as RouteState | null;

  const exam: Exam = routeState?.exam ?? "ensa";
  const [screen, setScreen] = useState<Screen>("config");
  const [setup, setSetup] = useState<SessionSetup | null>(null);
  const [questions, setQuestions] = useState<PrepQuestion[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [totalElapsed, setTotalElapsed] = useState(0);

  if (!routeState?.exam) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-navy-400 mb-4">Concours non spécifié.</p>
          <Link to="/prep" className="text-gold-400 font-bold hover:underline">← Retour à la préparation</Link>
        </div>
      </div>
    );
  }

  const handleStart = (s: SessionSetup) => {
    const qs = buildQuestions(s);
    if (qs.length === 0) return;
    setSetup(s);
    setQuestions(qs);
    setAnswers([]);
    setTotalElapsed(0);
    setScreen("session");
  };

  const handleFinish = (ans: Answer[], elapsed: number) => {
    setAnswers(ans);
    setTotalElapsed(elapsed);
    setScreen("results");
  };

  const handleRetry = () => {
    setScreen("config");
  };

  const handleRetryWrong = () => {
    if (!setup) return;
    const wrongQIds = answers.filter(a => !a.correct).map(a => questions[a.qIdx].id);
    const wrongQs = questions.filter(q => wrongQIds.includes(q.id));
    setQuestions(wrongQs.sort(() => Math.random() - 0.5));
    setAnswers([]);
    setTotalElapsed(0);
    setScreen("session");
  };

  if (screen === "config") {
    return (
      <ConfigScreen
        exam={exam}
        initialMode={routeState.mode}
        onStart={handleStart}
      />
    );
  }

  if (screen === "session" && setup) {
    return (
      <SessionScreen
        setup={setup}
        questions={questions}
        onFinish={handleFinish}
      />
    );
  }

  if (screen === "results" && setup) {
    return (
      <ResultsScreen
        setup={setup}
        questions={questions}
        answers={answers}
        totalElapsed={totalElapsed}
        onRetry={handleRetry}
        onRetryWrong={handleRetryWrong}
      />
    );
  }

  return null;
}
