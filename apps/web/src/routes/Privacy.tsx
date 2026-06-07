import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      <h1 className="text-3xl font-bold text-slate-900 mb-6">{t("consent.title")}</h1>
      <div className="prose prose-slate">
        <p className="mb-4">{t("consent.text")}</p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Politique de confidentialité CNDP</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li>Vos données sont conservées pendant 24 mois maximum.</li>
          <li>Aucune information personnelle n'est partagée sans votre consentement explicite.</li>
          <li>Vous pouvez demander la suppression de vos données à tout moment.</li>
          <li>Les adresses IP sont hashées et ne peuvent pas être retracées.</li>
          <li>Toutes les actions sur les données sont journalisées (audit trail).</li>
        </ul>
      </div>
    </motion.div>
  );
}
