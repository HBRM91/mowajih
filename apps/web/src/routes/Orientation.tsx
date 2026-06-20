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
  "Préparation de tes recommandations...",
];

function AnalysisScreen({ track }: { track: string }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % ANALYSIS_MESSAGES.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-navy-950 flex flex-col items-center justify-center text-white px-6"
    >
      <div className="relative w-32 h-32 mb-8 flex-shrink-0">
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
        <div className="absolute inset-0 flex items-center justify-center text-4xl">🎓</div>
      </div>

      <h2 className="font-heading text-2xl font-bold mb-2 text-center">Slimane analyse ton profil</h2>
      {track && <span className="text-gold-400 text-sm font-medium mb-6">Bac {track} · 5 critères évalués</span>}

      <div className="h-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-navy-300 text-sm text-center"
          >
            {ANALYSIS_MESSAGES[msgIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

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
        <title>Questionnaire d'Orientation — JAD2 TAWJIH</title>
        <meta name="description" content="3 questions · 2 minutes · 100% gratuit. JAD2 TAWJIH te recommande tes meilleures écoles parmi 100+ établissements marocains." />
        <link rel="canonical" href="https://tawjih.jad2advisory.com/orientation" />
      </Helmet>

      <AnimatePresence>
        {evaluate.isPending && <AnalysisScreen track={bacTrack} />}
      </AnimatePresence>

      {/* Full-page dark background for focus */}
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 pt-20 pb-16 px-4">
        <div className="max-w-lg mx-auto">

          {/* Urgency banner */}
          {daysLeft > 0 && daysLeft <= 30 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-3 bg-amber-500/15 border border-amber-400/30 rounded-2xl px-4 py-3"
            >
              <span className="text-lg flex-shrink-0">⏰</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-amber-200">
                  Plus que {daysLeft} jours — clôture cursussup.gov.ma
                </span>
                <span className="block text-[11px] text-amber-400/80 mt-0.5">
                  ENSA, ENCG, ENSAM · inscriptions closes le 15 juillet 2026
                </span>
              </div>
              <span className="text-2xl font-heading font-black text-amber-300 flex-shrink-0">{daysLeft}j</span>
            </motion.div>
          )}

          {/* White card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl shadow-navy-950/50 overflow-hidden"
          >
            {/* Progress bar header */}
            <div className="border-b border-gray-100">
              <ProgressBar step={step} />
            </div>

            {/* Step content */}
            <div className="px-6 py-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <StepTrack />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <StepGrades />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <StepProfile onSubmit={handleSubmit} isLoading={evaluate.isPending} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Trust footer */}
          <p className="text-center text-white/30 text-xs mt-5 flex items-center justify-center gap-3">
            <span>🛡️ Données anonymes</span>
            <span className="text-white/15">·</span>
            <span>Conforme CNDP</span>
            <span className="text-white/15">·</span>
            <span>Aucun compte requis</span>
          </p>
        </div>
      </div>
    </>
  );
}
