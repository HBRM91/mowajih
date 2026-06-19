import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useWishlistStore } from "../stores/wishlistStore";
import { getSchoolBySlug, ADMISSION_COLORS } from "../data/schools";
import { getSchoolCareers } from "../data/careers";
import SchoolLogo from "../components/ui/SchoolLogo";
import { useCompareStore } from "../stores/compareStore";

export default function Favorites() {
  const { slugs, toggle, clear } = useWishlistStore();
  const { toggle: compareToggle, has: inCompare, schools: compareSchools } = useCompareStore();

  const schools = slugs.map((s) => getSchoolBySlug(s)).filter(Boolean) as NonNullable<ReturnType<typeof getSchoolBySlug>>[];

  return (
    <div className="min-h-screen bg-cream">
      <Helmet>
        <title>Mes écoles favorites | JAD2 TAWJIH</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-navy-950 to-navy-900 text-white pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <Link to="/ecoles" className="inline-flex items-center gap-2 text-navy-300 hover:text-gold-300 text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux écoles
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <span>❤️</span> Mes écoles favorites
              </h1>
              <p className="text-navy-300 text-sm">
                {schools.length === 0
                  ? "Aucune école sauvegardée pour l'instant"
                  : `${schools.length} école${schools.length > 1 ? "s" : ""} sauvegardée${schools.length > 1 ? "s" : ""} · stockées localement, aucune donnée envoyée`}
              </p>
            </div>
            {schools.length > 0 && (
              <button
                onClick={clear}
                className="text-xs text-navy-400 hover:text-white border border-white/10 rounded-xl px-3 py-2 transition-colors"
              >
                Tout effacer
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {schools.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-6xl mb-6">🤍</div>
            <h2 className="font-heading text-2xl font-bold text-navy-800 mb-3">Aucune école sauvegardée</h2>
            <p className="text-navy-400 mb-8">Clique sur le ❤️ sur n'importe quelle fiche école pour l'ajouter ici.</p>
            <Link
              to="/ecoles"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold hover:shadow-lg transition-all"
            >
              Explorer les écoles →
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Quick actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                to="/orientation"
                className="flex items-center gap-2 px-5 py-2.5 bg-navy-800 text-white rounded-full text-sm font-semibold hover:bg-navy-900 transition-colors"
              >
                🎯 Faire le questionnaire
              </Link>
              <Link
                to="/comparer"
                className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-navy-900 rounded-full text-sm font-semibold hover:bg-gold-400 transition-colors"
              >
                ⚖ Comparer mes favoris
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {schools.map((school, i) => {
                const admColors = ADMISSION_COLORS[school.admission];
                const careerInfo = getSchoolCareers(school.slug);
                const isFree = school.annualCostMAD[0] === 0 && school.annualCostMAD[1] <= 3000;
                const costText = isFree
                  ? "Gratuit 🎉"
                  : `${school.annualCostMAD[0].toLocaleString("fr-FR")}–${school.annualCostMAD[1].toLocaleString("fr-FR")} MAD/an`;

                return (
                  <motion.div
                    key={school.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative bg-white rounded-2xl border border-parchment overflow-hidden group"
                  >
                    <div className={`h-1 w-full ${school.tier === "elite" ? "bg-gradient-to-r from-amber-400 to-gold-500" : school.tier === "premium" ? "bg-gradient-to-r from-blue-400 to-blue-600" : "bg-gradient-to-r from-emerald-400 to-emerald-600"}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <SchoolLogo school={school} />
                          <div>
                            <div className="font-bold text-navy-800 text-sm">{school.shortName}</div>
                            <div className="text-xs text-navy-400">{school.city}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggle(school.slug)}
                          className="text-rose-500 hover:text-rose-300 transition-colors p-1"
                          title="Retirer des favoris"
                        >
                          ❤️
                        </button>
                      </div>

                      <p className="text-navy-500 text-xs leading-relaxed mb-3 line-clamp-2">{school.description}</p>

                      {careerInfo && (
                        <div className="flex items-center gap-3 text-[10px] mb-3 py-2 border-y border-parchment">
                          <span className="font-bold text-emerald-700">💰 {careerInfo.avgStartSalaryMAD.toLocaleString("fr-FR")} MAD départ</span>
                          <span className="text-emerald-700 font-bold">· {careerInfo.employmentRate}% emploi</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${admColors.bg} ${admColors.text} ${admColors.border}`}>
                          {school.admission.toUpperCase()}
                        </span>
                        <span className={`text-xs font-bold ${isFree ? "text-emerald-600" : "text-navy-500"}`}>{costText}</span>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Link
                          to={`/ecoles/${school.slug}`}
                          className="flex-1 py-2 text-center text-xs font-bold bg-navy-800 text-white rounded-xl hover:bg-navy-900 transition-colors"
                        >
                          Voir la fiche
                        </Link>
                        <button
                          onClick={() => compareToggle(school)}
                          disabled={!inCompare(school.slug) && compareSchools.length >= 3}
                          className={`flex-1 py-2 text-center text-xs font-bold rounded-xl border transition-colors ${
                            inCompare(school.slug)
                              ? "bg-gold-500 text-navy-900 border-gold-400"
                              : compareSchools.length >= 3
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "border-gold-300 text-gold-700 hover:bg-gold-50"
                          }`}
                        >
                          {inCompare(school.slug) ? "✓ Comparé" : "⚖ Comparer"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
