import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useFormStore } from "../stores/formStore";
import { useEvaluate } from "../hooks/useOrientation";
import StepTrack from "../components/orientation/StepTrack";
import StepGrades from "../components/orientation/StepGrades";
import StepProfile from "../components/orientation/StepProfile";
import ProgressBar from "../components/orientation/ProgressBar";
import { useState, useEffect } from "react";

// Days until July 15, 2026 cursussup deadline
function getDaysUntilDeadline(): number {
  const deadline = new Date("2026-07-15T23:59:00");
  const diff = deadline.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

const ANALYSIS_MESSAGES = [
  "Analyse de ton profil bac...",
  "Parcours 100 établissements marocains...",
  "Calcul des scores de compatibilité...",
  "Application des critères d'admission...",
  "Préparation de tes recommandations personnalisées...",
];

function AnalysisScreen({ track }: { track: string }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const msgId = setInterval(() => setMsgIdx((i) => (i + 1) % ANALYSIS_MESSAGES.length), 1400);
    const dotId = setInterval(() => setDotCount((d) => (d + 1) % 4), 400);
    return () => { clearInterval(msgId); clearInterval(dotId); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-navy-950 flex flex-col items-center justify-center text-white px-6"
    >
      {/* Animated radar rings */}
      <div className="relative w-36 h-36 mb-10 flex-shrink-0">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-gold-400/30"
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, delay: i * 0.7, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-2 border-gold-500/20 border-t-gold-500"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">🎓</span>
        </div>
      </div>

      <h2 className="font-heading text-2xl font-bold text-white mb-2 text-center">
        Slimane analyse ton profil
      </h2>
      {track && (
        <span className="text-gold-400 text-sm font-medium mb-6">Bac {track} · {ANALYSIS_MESSAGES.length} critères évalués</span>
      )}

      <div className="h-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-navy-300 text-sm text-center"
          >
            {ANALYSIS_MESSAGES[msgIdx]}{"." .repeat(dotCount)}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress pills */}
      <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-xs">
        {[
          { icon: "🏛️", label: "100 établissements" },
          { icon: "📐", label: "Critères d'admission" },
          { icon: "📍", label: "Proximité & budget" },
          { icon: "🏆", label: "Score de compatibilité" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15 + 0.3 }}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5"
          >
            <span className="text-sm">{item.icon}</span>
            <span className="text-[11px] text-navy-300 font-medium">{item.label}</span>
            <motion.div
              className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>

      <p className="mt-8 text-xs text-navy-500">Résultats générés par l'IA · 2–4 secondes</p>
    </motion.div>
  );
}

export default function Orientation() {
  const step = useFormStore((s) => s.step);
  const bacTrack = useFormStore((s) => s.bacTrack);
  const form = useFormStore();
  const evaluate = useEvaluate();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const daysLeft = getDaysUntilDeadline();

  const handleSubmit = async () => {
    const parseGrade = (v: string) => (v && v.trim() !== "" ? parseFloat(v) : undefined);
    const payload = {
      bacTrack: form.bacTrack,
      generalGrade: parseFloat(form.generalGrade),
      mathGrade: parseGrade(form.mathGrade),
      physicsGrade: parseGrade(form.physicsGrade),
      biologyGrade: parseGrade(form.biologyGrade),
      economicsGrade: parseGrade(form.economicsGrade),
      techGrade: parseGrade(form.techGrade),
      city: form.city,
      region: form.region,
      financialBracket: form.financialBracket,
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
      emailContact: form.emailContact || undefined,
      phoneContact: form.phoneContact || undefined,
      consentPrivateSchools: form.consentPrivateSchools || undefined,
      language: i18n.language,
    };

    const result = await evaluate.mutateAsync(payload);
    navigate(`/results/${result.studentUuid}`, { state: result });
  };

  return (
    <>
      <Helmet>
        <title>Questionnaire d'Orientation — Trouve ton école idéale | JAD2 TAWJIH</title>
        <meta name="description" content="Réponds à 3 questions sur ta filière Bac, tes notes et ta ville — JAD2 TAWJIH te recommande tes meilleures écoles parmi 100+ établissements marocains. Gratuit, anonyme, résultats en 2 minutes." />
        <link rel="canonical" href="https://tawjih.jad2advisory.com/orientation" />
      </Helmet>

      {/* Analysis loading screen — full screen overlay */}
      <AnimatePresence>
        {evaluate.isPending && <AnalysisScreen track={bacTrack} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-xl mx-auto px-4 py-6"
      >
        {/* Urgency deadline banner */}
        {daysLeft > 0 && daysLeft <= 30 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3"
          >
            <span className="text-lg flex-shrink-0">⏰</span>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-amber-800">
                Plus que {daysLeft} jour{daysLeft > 1 ? "s" : ""} avant la clôture cursussup.gov.ma
              </span>
              <span className="block text-[10px] text-amber-600 mt-0.5">
                ENSA, ENCG, ENSAM — inscriptions closes le 15 juillet 2026
              </span>
            </div>
            <span className="text-2xl font-heading font-black text-amber-700 flex-shrink-0">{daysLeft}j</span>
          </motion.div>
        )}

        <ProgressBar step={step} />

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.25 }}>
                <StepTrack />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.25 }}>
                <StepGrades />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.25 }}>
                <StepProfile onSubmit={handleSubmit} isLoading={evaluate.isPending} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
