import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Alternative {
  name: string;
  type: string;
  reason: string;
}

export default function AlternativeList({ alternatives }: { alternatives: Alternative[] }) {
  const { t } = useTranslation();

  return (
    <div className="p-8 bg-gradient-to-br from-navy-50 to-navy-100/20 rounded-3xl border border-navy-200/30">
      <h3 className="font-heading text-xl font-bold text-navy-800 mb-2 text-center">{t("results.no_matches")}</h3>
      <p className="text-navy-400 text-sm text-center mb-6">{t("results.no_matches_reassurance")}</p>
      <div className="space-y-3">
        {alternatives.map((alt, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-5 bg-white rounded-2xl border border-gold-100/50 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">
                {alt.type === "public" ? "🏛️" : alt.type === "private" ? "🏫" : "🔧"}
              </span>
              <h4 className="font-heading font-bold text-navy-800">{alt.name}</h4>
            </div>
            <p className="text-sm text-navy-400">{alt.reason}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
