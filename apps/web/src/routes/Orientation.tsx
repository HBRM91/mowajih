import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

  const handleSubmit = async (turnstileToken?: string) => {
    const payload = {
      bacTrack: form.bacTrack,
      mathGrade: form.mathGrade ? parseFloat(form.mathGrade) : undefined,
      physicsGrade: form.physicsGrade ? parseFloat(form.physicsGrade) : undefined,
      generalGrade: parseFloat(form.generalGrade),
      city: form.city,
      region: form.region,
      financialBracket: form.financialBracket,
      turnstileToken: turnstileToken ?? "",
      consent: form.consent as true,
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
              <StepConsent onSubmit={handleSubmit} isLoading={evaluate.isPending} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
