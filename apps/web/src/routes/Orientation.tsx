import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormStore } from "../stores/formStore";
import { useEvaluate } from "../hooks/useOrientation";
import StepTrack from "../components/orientation/StepTrack";
import StepGrades from "../components/orientation/StepGrades";
import StepProfile from "../components/orientation/StepProfile";
import StepConsent from "../components/orientation/StepConsent";
import ProgressBar from "../components/orientation/ProgressBar";

export default function Orientation() {
  const step = useFormStore((s) => s.step);
  const form = useFormStore();
  const evaluate = useEvaluate();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-xl mx-auto px-4 py-8"
    >
      <ProgressBar step={step} />
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
              <StepTrack />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
              <StepGrades />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
              <StepProfile />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="step4" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
              <StepConsent onSubmit={() => handleSubmit()} isLoading={evaluate.isPending} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
