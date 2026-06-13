import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  SCHOOLS,
  TIER_LABELS,
  TIER_COLORS,
  ADMISSION_LABELS,
  ADMISSION_COLORS,
  TYPE_LABELS,
  getSchoolBySlug,
} from "../data/schools";

const TRACK_LABELS: Record<string, string> = {
  SM: "Sciences Mathématiques",
  PC: "Sciences Physiques",
  SVT: "Sciences de la Vie & Terre",
  SE: "Sciences Économiques",
  SH: "Sciences Humaines",
  STI: "Sciences Techniques",
  L: "Lettres",
};

function AdmissionGuide({ school }: { school: ReturnType<typeof getSchoolBySlug> }) {
  if (!school) return null;
  const { admission } = school;

  if (admission === "cnc") {
    return (
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📐</span>
          <h4 className="font-bold text-violet-800">Voie CPGE + Concours CNC</h4>
        </div>
        <ol className="space-y-2 text-sm text-violet-700">
          <li className="flex gap-2"><span className="font-bold text-violet-500 flex-shrink-0">1.</span> Intégrer une CPGE scientifique (MP / PSI / MPSI / TSI) après le Bac — sélection sur dossier avec mention Bien ou TB.</li>
          <li className="flex gap-2"><span className="font-bold text-violet-500 flex-shrink-0">2.</span> Préparer pendant 2 ans (classes de MP1, MP2 ou PSI1, PSI2).</li>
          <li className="flex gap-2"><span className="font-bold text-violet-500 flex-shrink-0">3.</span> Passer le Concours National Commun (CNC) en fin de 2e année. Notes des deux années sont prises en compte.</li>
          <li className="flex gap-2"><span className="font-bold text-violet-500 flex-shrink-0">4.</span> Classement sur 4 000–6 000 candidats nationaux. Les meilleurs intègrent EMI, EHTP, ENSIAS, INPT, etc.</li>
        </ol>
        <div className="mt-3 pt-3 border-t border-violet-200 text-xs text-violet-500">
          Dossier de candidature CPGE : cursussup.gov.ma · Résultats CNC : mcs.ac.ma
        </div>
      </div>
    );
  }

  if (admission === "concours" && (school.tracks.includes("SM") || school.tracks.includes("PC")) && school.type === "engineering") {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📋</span>
          <h4 className="font-bold text-orange-800">Admission directe Bac (plateforme Tawjihi)</h4>
        </div>
        <div className="mb-3 bg-orange-100 rounded-xl p-3">
          <p className="text-xs font-bold text-orange-700 mb-1">Formule de sélection 75/25 :</p>
          <p className="text-sm font-mono text-orange-800">Moyenne = (Note nationale × 0,75) + (Note régionale × 0,25)</p>
          <p className="text-xs text-orange-600 mt-1">La note régionale correspond aux notes du contrôle continu (devoirs & épreuves régionales).</p>
        </div>
        <ol className="space-y-2 text-sm text-orange-700">
          <li className="flex gap-2"><span className="font-bold text-orange-500 flex-shrink-0">1.</span> Obtenir ton Bac avec la moyenne requise (note min : <strong>{school.minGrade}/20</strong>).</li>
          <li className="flex gap-2"><span className="font-bold text-orange-500 flex-shrink-0">2.</span> Candidater sur <strong>cursussup.gov.ma</strong> ou <strong>tawjihi.ma</strong> dès la publication des résultats.</li>
          <li className="flex gap-2"><span className="font-bold text-orange-500 flex-shrink-0">3.</span> La sélection se fait par classement selon la formule 75/25. Le nombre de places est limité.</li>
          <li className="flex gap-2"><span className="font-bold text-orange-500 flex-shrink-0">4.</span> Confirmer le choix dans les délais impartis (généralement 72h après l'affectation).</li>
        </ol>
      </div>
    );
  }

  if (admission === "tafem") {
    return (
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📝</span>
          <h4 className="font-bold text-sky-800">Concours TAFEM (ENCG)</h4>
        </div>
        <ol className="space-y-2 text-sm text-sky-700">
          <li className="flex gap-2"><span className="font-bold text-sky-500 flex-shrink-0">1.</span> Présélection sur dossier Bac via cursussup.gov.ma (seuil minimum variable selon campus).</li>
          <li className="flex gap-2"><span className="font-bold text-sky-500 flex-shrink-0">2.</span> Épreuve écrite TAFEM : Culture générale, Mathématiques, Logique, Économie (3h).</li>
          <li className="flex gap-2"><span className="font-bold text-sky-500 flex-shrink-0">3.</span> Oral / entretien de motivation pour les candidats retenus.</li>
          <li className="flex gap-2"><span className="font-bold text-sky-500 flex-shrink-0">4.</span> Classement final = note Bac + note TAFEM + note oral.</li>
        </ol>
        <div className="mt-3 pt-3 border-t border-sky-200 text-xs text-sky-500">
          Inscriptions : cursussup.gov.ma · Site ENCG : encg.ac.ma
        </div>
      </div>
    );
  }

  if (admission === "dossier") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📁</span>
          <h4 className="font-bold text-emerald-800">Admission sur dossier + entretien</h4>
        </div>
        <ol className="space-y-2 text-sm text-emerald-700">
          <li className="flex gap-2"><span className="font-bold text-emerald-500 flex-shrink-0">1.</span> Consulter les dates d'ouverture des candidatures sur le site officiel de l'établissement.</li>
          <li className="flex gap-2"><span className="font-bold text-emerald-500 flex-shrink-0">2.</span> Préparer le dossier : relevés de notes du Bac, lettre de motivation, CV, résultats de tests (SAT/ACT pour certaines).</li>
          <li className="flex gap-2"><span className="font-bold text-emerald-500 flex-shrink-0">3.</span> Passer l'entretien de motivation ou le test d'admission de l'école.</li>
          <li className="flex gap-2"><span className="font-bold text-emerald-500 flex-shrink-0">4.</span> Attendre la décision et répondre dans les délais.</li>
        </ol>
        {school.website && (
          <div className="mt-3 pt-3 border-t border-emerald-200 text-xs text-emerald-600">
            Site officiel : <a href={school.website} target="_blank" rel="noopener noreferrer" className="underline">{school.website}</a>
          </div>
        )}
      </div>
    );
  }

  if (admission === "direct") {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎓</span>
          <h4 className="font-bold text-slate-700">Inscription directe sur Bac</h4>
        </div>
        <ol className="space-y-2 text-sm text-slate-600">
          <li className="flex gap-2"><span className="font-bold text-slate-400 flex-shrink-0">1.</span> Obtenir ton Bac dans la filière concernée.</li>
          <li className="flex gap-2"><span className="font-bold text-slate-400 flex-shrink-0">2.</span> S'inscrire directement à la faculté après publication des résultats du Bac.</li>
          <li className="flex gap-2"><span className="font-bold text-slate-400 flex-shrink-0">3.</span> Apporter les documents requis : attestation de réussite au Bac, CIN, photos d'identité, dossier médical.</li>
          <li className="flex gap-2"><span className="font-bold text-slate-400 flex-shrink-0">4.</span> Choisir ta branche/filière d'études lors de l'inscription. Certaines filières peuvent être limitées.</li>
        </ol>
        <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
          Portail universitaire : <strong>cursussup.gov.ma</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">📋</span>
        <h4 className="font-bold text-orange-800">{ADMISSION_LABELS[admission]}</h4>
      </div>
      <p className="text-sm text-orange-700">Note minimale recommandée : <strong>{school.minGrade}/20</strong></p>
      {school.website && (
        <a href={school.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-orange-600 underline">
          {school.website}
        </a>
      )}
    </div>
  );
}

export default function SchoolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const school = getSchoolBySlug(slug ?? "");

  if (!school) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">🏛️</div>
        <h1 className="font-heading text-2xl font-bold text-navy-800">École introuvable</h1>
        <p className="text-navy-400">L'identifiant "{slug}" ne correspond à aucun établissement référencé.</p>
        <Link to="/ecoles" className="px-6 py-3 bg-navy-800 text-white rounded-full font-bold hover:bg-navy-700 transition-colors">
          Retour aux écoles
        </Link>
      </div>
    );
  }

  const tierColors = TIER_COLORS[school.tier];
  const admColors = ADMISSION_COLORS[school.admission];
  const isFree = school.annualCostMAD[0] === 0 && school.annualCostMAD[1] <= 3000;
  const costText = isFree
    ? "Gratuit"
    : `${school.annualCostMAD[0].toLocaleString("fr-FR")} – ${school.annualCostMAD[1].toLocaleString("fr-FR")} MAD/an`;

  const similarSchools = SCHOOLS.filter(
    (s) => s.slug !== school.slug && s.type === school.type && s.tier === school.tier
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white pt-24 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-campus.jpeg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 to-navy-900/95" />
        <div className="relative max-w-5xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
            <Link to="/" className="hover:text-gold-300 transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/ecoles" className="hover:text-gold-300 transition-colors">Écoles</Link>
            <span>/</span>
            <span className="text-navy-200">{school.shortName}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Icon */}
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 ${tierColors.bg} border-2 ${tierColors.border}`}>
                {school.icon}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${tierColors.bg} ${tierColors.text} ${tierColors.border}`}>
                    {TIER_LABELS[school.tier]}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${admColors.bg} ${admColors.text} ${admColors.border}`}>
                    {ADMISSION_LABELS[school.admission]}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${school.access === "public" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {school.access === "public" ? "Public" : school.access === "semi-public" ? "Semi-public" : "Privé"}
                  </span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-1">{school.name}</h1>
                <p className="text-navy-300 text-sm flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {school.cities ? school.cities.join(", ") : school.city} · {school.region}
                  {school.founded && <><span className="text-navy-500 mx-1">·</span>Fondée en {school.founded}</>}
                </p>
              </div>
              {school.website && (
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Site officiel
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick stats bar */}
      <div className="bg-white border-b border-parchment sticky top-16 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-navy-400">Note min.</span>
              <strong className="text-navy-800">{school.minGrade}/20</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-navy-400">Coût annuel</span>
              <strong className={isFree ? "text-emerald-600" : "text-navy-800"}>{costText}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-navy-400">Domaine</span>
              <strong className="text-navy-800">{TYPE_LABELS[school.type]}</strong>
            </div>
            {school.enrollmentCount && (
              <div className="flex items-center gap-2">
                <span className="text-navy-400">Étudiants/an</span>
                <strong className="text-navy-800">~{school.enrollmentCount.toLocaleString("fr-FR")}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-heading text-2xl font-bold text-navy-800 mb-4">Présentation</h2>
              <p className="text-navy-600 leading-relaxed text-base">{school.description}</p>

              {school.history && (
                <div className="mt-4 p-4 bg-parchment/60 border border-gold-100 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📜</span>
                    <h3 className="font-bold text-navy-700 text-sm">Historique</h3>
                  </div>
                  <p className="text-navy-500 text-sm leading-relaxed">{school.history}</p>
                </div>
              )}
            </motion.section>

            {/* Programs */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-heading text-2xl font-bold text-navy-800 mb-4">Formations proposées</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {school.programs.map((prog, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-parchment rounded-xl p-3">
                    <div className="w-7 h-7 rounded-lg bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold-600 text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-navy-700 text-sm font-medium">{prog}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Admission guide */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-heading text-2xl font-bold text-navy-800 mb-4">Processus d'admission</h2>
              <AdmissionGuide school={school} />

              {school.cpgeFilières && (
                <div className="mt-4 bg-violet-50 border border-violet-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-2">Filières CPGE acceptées</p>
                  <div className="flex flex-wrap gap-2">
                    {school.cpgeFilières.map((f) => (
                      <span key={f} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-bold border border-violet-200">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>

            {/* Highlights */}
            {(school.highlights?.length ?? 0) > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <h2 className="font-heading text-2xl font-bold text-navy-800 mb-4">Points forts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(school.highlights ?? []).map((h, i) => (
                    <div key={i} className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-emerald-800 text-sm font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Tracks */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="bg-white border border-parchment rounded-2xl p-5">
              <h3 className="font-bold text-navy-700 mb-3 text-sm uppercase tracking-wider">Filières Bac acceptées</h3>
              <div className="space-y-2">
                {school.tracks.map((track) => (
                  <div key={track} className="flex items-center gap-2 text-sm">
                    <span className="w-8 text-center font-bold text-navy-700 bg-navy-50 rounded-lg py-0.5 text-xs border border-navy-100">
                      {track}
                    </span>
                    <span className="text-navy-500">{TRACK_LABELS[track] ?? track}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Cost breakdown */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white border border-parchment rounded-2xl p-5">
              <h3 className="font-bold text-navy-700 mb-3 text-sm uppercase tracking-wider">Coût estimé</h3>
              <div className={`text-2xl font-heading font-bold mb-1 ${isFree ? "text-emerald-600" : "text-navy-800"}`}>
                {isFree ? "Gratuit 🎉" : `${school.annualCostMAD[0].toLocaleString("fr-FR")} MAD`}
              </div>
              {!isFree && (
                <p className="text-xs text-navy-400">
                  à {school.annualCostMAD[1].toLocaleString("fr-FR")} MAD/an selon les options
                </p>
              )}
              {isFree && (
                <p className="text-xs text-emerald-600">Frais d'inscription symboliques uniquement (~{school.annualCostMAD[1].toLocaleString("fr-FR")} MAD/an)</p>
              )}
              <div className="mt-4 pt-3 border-t border-parchment">
                <p className="text-xs text-navy-400">
                  Bourse Minhaty disponible sous conditions de ressources : <a href="https://www.minhaty.ma" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline">minhaty.ma</a>
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-5 text-white">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold mb-2">Suis-je éligible ?</h3>
              <p className="text-navy-300 text-xs mb-4 leading-relaxed">
                Remplis le questionnaire Slimane IA pour savoir si ton profil Bac correspond aux critères de sélection.
              </p>
              <Link
                to="/orientation"
                className="block text-center py-3 px-4 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-gold-500/20 transition-all"
              >
                Tester mon éligibilité
              </Link>
            </motion.div>

            {/* Official links */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-white border border-parchment rounded-2xl p-5">
              <h3 className="font-bold text-navy-700 mb-3 text-sm uppercase tracking-wider">Liens utiles</h3>
              <div className="space-y-2">
                <a href="https://cursussup.gov.ma" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-navy-600 hover:text-gold-600 transition-colors">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  cursussup.gov.ma (Candidatures)
                </a>
                <a href="https://www.minhaty.ma" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-navy-600 hover:text-gold-600 transition-colors">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  minhaty.ma (Bourses)
                </a>
                {school.website && (
                  <a href={school.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-navy-600 hover:text-gold-600 transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {school.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Similar schools */}
        {similarSchools.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-14">
            <h2 className="font-heading text-2xl font-bold text-navy-800 mb-6">Établissements similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarSchools.map((s) => {
                const tc = TIER_COLORS[s.tier];
                return (
                  <Link
                    key={s.slug}
                    to={`/ecoles/${s.slug}`}
                    className="bg-white border border-parchment hover:border-gold-300 hover:shadow-lg rounded-2xl p-4 transition-all group block"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${tc.bg}`}>{s.icon}</div>
                    <div className="font-bold text-navy-800 text-sm group-hover:text-gold-700 transition-colors">{s.shortName}</div>
                    <div className="text-xs text-navy-400 mt-0.5">{s.city}</div>
                    <div className={`mt-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border w-fit ${tc.bg} ${tc.text} ${tc.border}`}>
                      {TIER_LABELS[s.tier]}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <Link to="/ecoles" className="text-sm text-gold-600 hover:text-gold-700 font-semibold inline-flex items-center gap-1 transition-colors">
                Voir tous les établissements
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
