import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCompareStore } from "../stores/compareStore";
import { SCHOOLS, TIER_COLORS, ADMISSION_COLORS } from "../data/schools";
import SchoolLogo from "../components/ui/SchoolLogo";

const COMPARE_ROWS = [
  { key: "tier", label: "Sélectivité" },
  { key: "access", label: "Statut" },
  { key: "admission", label: "Mode d'admission" },
  { key: "minGrade", label: "Note minimale" },
  { key: "annualCostMAD", label: "Frais annuels (MAD)" },
  { key: "city", label: "Ville" },
  { key: "tracks", label: "Bacs acceptés" },
  { key: "programs", label: "Formations" },
];

const TIER_LABELS: Record<string, string> = {
  elite: "Elite", premium: "Premium", selective: "Sélectif", standard: "Standard", accessible: "Accessible",
};
const ADMISSION_LABELS: Record<string, string> = {
  cnc: "CPGE + CNC", tafem: "TAFEM concours", concours: "Concours propre", dossier: "Dossier/entretien", direct: "Inscription libre",
};
const ACCESS_LABELS: Record<string, string> = {
  public: "Public", private: "Privé", "semi-public": "Semi-public",
};

function CellValue({ rowKey, school }: { rowKey: string; school: typeof SCHOOLS[0] }) {
  const tc = TIER_COLORS[school.tier];
  switch (rowKey) {
    case "tier":
      return (
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${tc.bg} ${tc.text} ${tc.border}`}>
          {TIER_LABELS[school.tier]}
        </span>
      );
    case "access":
      return (
        <span className={`text-sm font-medium ${school.access === "public" ? "text-emerald-700" : school.access === "private" ? "text-amber-700" : "text-blue-700"}`}>
          {ACCESS_LABELS[school.access]}
        </span>
      );
    case "admission": {
      const ac = ADMISSION_COLORS[school.admission];
      return (
        <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-semibold ${ac?.bg ?? "bg-gray-100"} ${ac?.text ?? "text-gray-700"}`}>
          {ADMISSION_LABELS[school.admission]}
        </span>
      );
    }
    case "minGrade":
      return (
        <span className="text-sm font-bold text-navy-800">
          {school.minGrade}/20
        </span>
      );
    case "annualCostMAD": {
      const [lo, hi] = school.annualCostMAD;
      if (lo === 0 && hi <= 3000) return <span className="text-sm font-semibold text-emerald-700">Quasi gratuit</span>;
      return (
        <span className="text-sm font-medium text-navy-700">
          {lo.toLocaleString("fr-MA")} – {hi.toLocaleString("fr-MA")} MAD
        </span>
      );
    }
    case "city":
      return <span className="text-sm text-navy-700 flex items-center gap-1">📍 {school.city}</span>;
    case "tracks":
      return (
        <div className="flex flex-wrap gap-1">
          {school.tracks.map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-navy-100 text-navy-600 rounded font-semibold">
              {t}
            </span>
          ))}
        </div>
      );
    case "programs":
      return (
        <ul className="space-y-0.5">
          {school.programs.slice(0, 3).map((p) => (
            <li key={p} className="text-xs text-navy-600 flex items-start gap-1">
              <span className="text-gold-500 mt-0.5 flex-shrink-0">→</span>
              {p}
            </li>
          ))}
          {school.programs.length > 3 && (
            <li className="text-[10px] text-navy-400">+{school.programs.length - 3} autres</li>
          )}
        </ul>
      );
    default:
      return null;
  }
}

export default function Compare() {
  const { schools, remove, clear } = useCompareStore();

  return (
    <div className="min-h-screen bg-cream pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-gold-600 text-sm font-bold uppercase tracking-[0.15em]">Outil de comparaison</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-800 mt-3 mb-3">
            Comparez vos écoles
          </h1>
          <p className="text-navy-400 max-w-xl mx-auto">
            Analysez côte à côte les caractéristiques de vos établissements cibles.
          </p>
        </motion.div>

        {schools.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">⚖️</div>
            <h2 className="font-heading text-2xl font-bold text-navy-700 mb-3">Aucune école sélectionnée</h2>
            <p className="text-navy-400 mb-8">Ajoutez jusqu'à 3 écoles depuis le catalogue pour les comparer.</p>
            <Link
              to="/ecoles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 rounded-full font-bold hover:from-navy-800 hover:to-navy-900 transition-all shadow-lg"
            >
              Voir le catalogue
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-sm text-navy-500">
                {schools.length}/3 école{schools.length > 1 ? "s" : ""} sélectionnée{schools.length > 1 ? "s" : ""}
                {schools.length < 3 && (
                  <Link to="/ecoles" className="ml-2 text-gold-600 font-semibold hover:text-gold-700">
                    + Ajouter une école
                  </Link>
                )}
              </p>
              <button
                onClick={clear}
                className="text-sm text-rose-500 hover:text-rose-700 font-medium transition"
              >
                Effacer tout
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-gold-100/60 shadow-sm overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold-100">
                    <th className="text-left p-5 w-36 text-xs font-bold text-navy-400 uppercase tracking-wider">Critère</th>
                    {schools.map((school) => (
                      <th key={school.slug} className="p-5 text-center min-w-[200px]">
                        <div className="flex flex-col items-center gap-3">
                          <SchoolLogo school={school} size="lg" />
                          <div>
                            <div className="font-heading font-bold text-navy-800 text-sm leading-tight">{school.shortName}</div>
                            <div className="text-xs text-navy-400 mt-0.5">{school.city}</div>
                          </div>
                          <button
                            onClick={() => remove(school.slug)}
                            className="text-[10px] text-rose-400 hover:text-rose-600 font-medium transition"
                          >
                            Retirer
                          </button>
                        </div>
                      </th>
                    ))}
                    {schools.length < 3 && (
                      <th className="p-5 text-center min-w-[180px]">
                        <Link to="/ecoles" className="flex flex-col items-center gap-2 text-navy-300 hover:text-navy-600 transition group">
                          <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-navy-200 group-hover:border-gold-400 flex items-center justify-center text-3xl transition">
                            +
                          </div>
                          <span className="text-xs font-medium">Ajouter une école</span>
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr key={row.key} className={i % 2 === 0 ? "bg-cream/30" : ""}>
                      <td className="p-4 text-xs font-bold text-navy-500 uppercase tracking-wide border-r border-gold-50">
                        {row.label}
                      </td>
                      {schools.map((school) => (
                        <td key={school.slug} className="p-4 text-center">
                          <CellValue rowKey={row.key} school={school} />
                        </td>
                      ))}
                      {schools.length < 3 && <td />}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {schools.map((school) => (
                <Link
                  key={school.slug}
                  to={`/ecoles/${school.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold-200 text-navy-700 rounded-xl text-sm font-semibold hover:bg-gold-50 hover:border-gold-400 transition-all"
                >
                  Voir fiche {school.shortName} →
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
