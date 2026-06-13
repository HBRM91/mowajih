import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { getSchoolCareers } from "../data/careers";
import { getSchoolCampusInfo } from "../data/campusData";

const TRACK_LABELS: Record<string, string> = {
  SM: "Sciences Mathématiques",
  PC: "Sciences Physiques",
  SVT: "Sciences de la Vie & Terre",
  SE: "Sciences Économiques",
  SH: "Sciences Humaines",
  STI: "Sciences Techniques",
  L: "Lettres",
};

function getDomainFromUrl(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function SchoolLogoHero({ school }: { school: ReturnType<typeof getSchoolBySlug> }) {
  if (!school) return null;
  const domain = getDomainFromUrl(school.website);
  const tierColors = TIER_COLORS[school.tier];
  // 0 = local logoPath, 1 = Clearbit, 2 = Google favicon, 3 = emoji
  const startLevel = school.logoPath ? 0 : domain ? 1 : 3;
  const [level, setLevel] = useState(startLevel);

  if (level >= 3 || (!school.logoPath && !domain)) {
    return (
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 ${tierColors.bg} border-2 ${tierColors.border}`}>
        {school.icon}
      </div>
    );
  }

  const src =
    level === 0 ? school.logoPath! :
    level === 1 ? `https://logo.clearbit.com/${domain}?size=128` :
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  return (
    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-white border-2 ${tierColors.border} p-1.5`}>
      <img
        src={src}
        alt={school.shortName}
        className="w-full h-full object-contain"
        onError={() => setLevel((l) => l + 1)}
      />
    </div>
  );
}

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

// ── Campus / Housing section ─────────────────────────────────────────────────
function CampusSection({ slug, city, lang }: { slug: string; city: string; lang: string }) {
  const { t } = useTranslation();
  const { isIntegrated, integrated, cityHousing } = getSchoolCampusInfo(slug, city);

  const tx = (obj: { fr: string; ar: string; en: string }) =>
    lang === "ar" ? obj.ar : lang === "en" ? obj.en : obj.fr;

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <h2 className="font-heading text-2xl font-bold text-navy-800 mb-4 flex items-center gap-2">
        🏠 {t("campus.section.title")}
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isIntegrated ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-blue-50 text-blue-700 border border-blue-200"
        }`}>
          {isIntegrated ? t("campus.integrated.badge") : city ? t("campus.urban.badge") : t("campus.regional.badge")}
        </span>
      </h2>

      <div className="space-y-4">
        {isIntegrated && integrated ? (
          <>
            {/* On-campus housing */}
            {integrated.onCampus && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-emerald-600 font-bold text-sm">✅ {t("campus.oncampus.title")}</span>
                  <span className="ml-auto font-heading font-bold text-emerald-700 text-sm">{integrated.onCampus.cost}</span>
                </div>
                {integrated.onCampus.girlsWing && (
                  <div className="flex items-center gap-1.5 text-xs text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-3 py-1.5 mb-3 w-fit">
                    <span>👩</span> {t("campus.oncampus.girls")}
                  </div>
                )}
                <div className="space-y-1">
                  {integrated.onCampus.facilities.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">→</span>
                      <span>{tx(f)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Housing options */}
            <div className="bg-white border border-parchment rounded-2xl p-5">
              <div className="font-bold text-navy-700 text-sm uppercase tracking-wider mb-3">{t("campus.housing.title")}</div>
              <div className="space-y-2">
                {integrated.housing.map((h, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 text-sm py-2 border-b border-parchment last:border-0">
                    <span className="text-navy-600">{tx(h.label)}</span>
                    <span className="font-bold text-navy-800 text-right flex-shrink-0">{h.cost}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scholarship note */}
            {integrated.scholarshipNote && (
              <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5">
                <div className="font-bold text-gold-800 text-sm mb-2">🎓 {t("campus.scholarship.title")}</div>
                <p className="text-sm text-gold-900 leading-relaxed">{tx(integrated.scholarshipNote)}</p>
              </div>
            )}

            {/* Safety */}
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5">
              <div className="font-bold text-pink-800 text-sm mb-2">👩 {t("campus.safety.girls_note")}</div>
              <p className="text-sm text-pink-900 leading-relaxed">{tx(integrated.safety)}</p>
            </div>

            {/* Transport */}
            {integrated.transport && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="font-bold text-blue-800 text-sm mb-1">🚌 {t("campus.transport.title")}</div>
                <p className="text-sm text-blue-900">{tx(integrated.transport)}</p>
              </div>
            )}
          </>
        ) : cityHousing ? (
          <>
            {/* State dorm note */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="font-bold text-amber-800 text-sm mb-2">🏛️ {t("campus.statedorm.title")}</div>
              <p className="text-sm text-amber-900 leading-relaxed">{tx(cityHousing.stateDormNote)}</p>
            </div>

            {/* Housing options */}
            <div className="bg-white border border-parchment rounded-2xl p-5">
              <div className="font-bold text-navy-700 text-sm uppercase tracking-wider mb-3">{t("campus.housing.title")}</div>
              <div className="space-y-2">
                {cityHousing.housing.map((h, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 text-sm py-2 border-b border-parchment last:border-0">
                    <span className="text-navy-600">{tx(h.label)}</span>
                    <span className="font-bold text-navy-800 text-right flex-shrink-0">{h.cost}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Private residences note */}
            <div className="bg-navy-50 border border-navy-200 rounded-2xl p-4">
              <div className="font-bold text-navy-700 text-sm mb-1">🏢 {t("campus.private_residence.label")}</div>
              <p className="text-xs text-navy-600">{t("campus.private_residence.desc")}</p>
            </div>

            {/* Neighborhoods */}
            {cityHousing.neighborhoods.length > 0 && (
              <div className="bg-white border border-parchment rounded-2xl p-5">
                <div className="font-bold text-navy-700 text-sm uppercase tracking-wider mb-3">📍 {t("campus.neighborhoods.title")}</div>
                <div className="flex flex-wrap gap-2">
                  {cityHousing.neighborhoods.map((n) => (
                    <span key={n} className="px-3 py-1.5 bg-gold-50 border border-gold-200 text-navy-700 text-sm rounded-full font-medium">{n}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Safety */}
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5">
              <div className="font-bold text-pink-800 text-sm mb-2">👩 {t("campus.safety.girls_note")}</div>
              <p className="text-sm text-pink-900 leading-relaxed">{tx(cityHousing.safety)}</p>
            </div>

            {/* Transport */}
            {cityHousing.transport && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="font-bold text-blue-800 text-sm mb-1">🚌 {t("campus.transport.title")}</div>
                <p className="text-sm text-blue-900">{tx(cityHousing.transport)}</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-navy-400 text-sm italic">{t("campus.no_data")}</div>
        )}
      </div>
    </motion.section>
  );
}

export default function SchoolDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const lang = (["fr", "ar", "en"].includes(i18n.language) ? i18n.language : "fr") as "fr" | "ar" | "en";
  const school = getSchoolBySlug(slug ?? "");
  const careers = getSchoolCareers(slug ?? "");

  if (!school) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">🏛️</div>
        <h1 className="font-heading text-2xl font-bold text-navy-800">{t("school.not_found.title")}</h1>
        <p className="text-navy-400">{t("school.not_found.text", { slug })}</p>
        <Link to="/ecoles" className="px-6 py-3 bg-navy-800 text-white rounded-full font-bold hover:bg-navy-700 transition-colors">
          {t("school.not_found.btn")}
        </Link>
      </div>
    );
  }

  const tierColors = TIER_COLORS[school.tier];
  const admColors = ADMISSION_COLORS[school.admission];
  const isFree = school.annualCostMAD[0] === 0 && school.annualCostMAD[1] <= 3000;
  const costText = isFree
    ? t("school.cost.free")
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
            <Link to="/" className="hover:text-gold-300 transition-colors">{t("nav.home")}</Link>
            <span>/</span>
            <Link to="/ecoles" className="hover:text-gold-300 transition-colors">{t("school.breadcrumb.schools")}</Link>
            <span>/</span>
            <span className="text-navy-200">{school.shortName}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <SchoolLogoHero school={school} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${tierColors.bg} ${tierColors.text} ${tierColors.border}`}>
                    {TIER_LABELS[school.tier]}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${admColors.bg} ${admColors.text} ${admColors.border}`}>
                    {ADMISSION_LABELS[school.admission]}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${school.access === "public" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {t(`access.${school.access}`)}
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
                  {t("school.official.site")}
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
              <span className="text-navy-400">
                {school.admission === "cnc" ? t("cpge.min_grade.label") : t("school.quick.min_grade")}
              </span>
              <strong className="text-navy-800">{school.minGrade}/20</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-navy-400">{t("school.quick.cost")}</span>
              <strong className={isFree ? "text-emerald-600" : "text-navy-800"}>{costText}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-navy-400">{t("school.quick.domain")}</span>
              <strong className="text-navy-800">{TYPE_LABELS[school.type]}</strong>
            </div>
            {school.enrollmentCount && (
              <div className="flex items-center gap-2">
                <span className="text-navy-400">{t("school.quick.enrollment")}</span>
                <strong className="text-navy-800">~{school.enrollmentCount.toLocaleString("fr-FR")}</strong>
              </div>
            )}
            {careers && (
              <div className="flex items-center gap-2">
                <span className="text-navy-400">{t("school.careers.rate")}</span>
                <strong className="text-emerald-600">{careers.employmentRate}%</strong>
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

            {/* CPGE Warning Banner */}
            {school.admission === "cnc" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 bg-violet-50 border-l-4 border-violet-500 rounded-2xl p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center flex-shrink-0 text-2xl">
                  📐
                </div>
                <div>
                  <p className="font-bold text-violet-800 text-sm leading-snug">{t("cpge.warning.title")}</p>
                  <p className="text-violet-700 text-sm mt-1.5 leading-relaxed">{t("cpge.warning.desc")}</p>
                </div>
              </motion.div>
            )}

            {/* Description */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-heading text-2xl font-bold text-navy-800 mb-4">{t("school.presentation")}</h2>
              <p className="text-navy-600 leading-relaxed text-base">{school.description}</p>

              {school.history && (
                <div className="mt-4 p-4 bg-parchment/60 border border-gold-100 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📜</span>
                    <h3 className="font-bold text-navy-700 text-sm">{t("school.history.label")}</h3>
                  </div>
                  <p className="text-navy-500 text-sm leading-relaxed">{school.history}</p>
                </div>
              )}
            </motion.section>

            {/* Programs */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-heading text-2xl font-bold text-navy-800 mb-4">{t("school.programs")}</h2>
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
              <h2 className="font-heading text-2xl font-bold text-navy-800 mb-4">{t("school.admission.title")}</h2>
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
                <h2 className="font-heading text-2xl font-bold text-navy-800 mb-4">{t("school.highlights")}</h2>
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

            {/* Careers & Salaries */}
            {careers && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="font-heading text-2xl font-bold text-navy-800 mb-4">{t("school.careers.title")}</h2>
                <div className="bg-gradient-to-br from-navy-50 to-gold-50 border border-gold-200 rounded-2xl p-6 space-y-5">

                  {/* Salary cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-parchment p-4 text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">{t("school.careers.start")}</div>
                      <div className="font-heading text-2xl font-bold text-navy-800">
                        {careers.avgStartSalaryMAD.toLocaleString("fr-FR")}
                      </div>
                      <div className="text-xs text-navy-400">MAD/mois</div>
                    </div>
                    <div className="bg-white rounded-xl border border-parchment p-4 text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">{t("school.careers.mid")}</div>
                      <div className="font-heading text-2xl font-bold text-gold-600">
                        {careers.avgMidSalaryMAD.toLocaleString("fr-FR")}
                      </div>
                      <div className="text-xs text-navy-400">MAD/mois</div>
                    </div>
                    <div className="bg-white rounded-xl border border-parchment p-4 text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-navy-400 mb-1">{t("school.careers.rate")}</div>
                      <div className="font-heading text-2xl font-bold text-emerald-600">{careers.employmentRate}%</div>
                      <div className="text-xs text-navy-400">à 6 mois</div>
                    </div>
                  </div>

                  {/* Job families */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-2">{t("school.careers.jobs")}</div>
                    <div className="flex flex-wrap gap-2">
                      {careers.jobFamilies.map((job) => (
                        <span key={job} className="px-3 py-1.5 bg-white border border-gold-200 text-navy-700 text-sm rounded-full font-medium">
                          {job}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Top employers */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-2">{t("school.careers.employers")}</div>
                    <div className="flex flex-wrap gap-2">
                      {careers.topEmployers.map((emp) => (
                        <span key={emp} className="px-3 py-1.5 bg-navy-800 text-white text-xs rounded-full font-semibold">
                          {emp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* International */}
                  {careers.internationalOpportunities !== undefined && (
                    <div className={`flex items-center gap-2 text-sm rounded-xl px-4 py-3 border ${careers.internationalOpportunities ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                      <span>{careers.internationalOpportunities ? "🌍" : "🇲🇦"}</span>
                      <span>{t(careers.internationalOpportunities ? "school.careers.international.yes" : "school.careers.international.no")}</span>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* Campus & Housing */}
            <CampusSection slug={school.slug} city={school.city} lang={lang} />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Tracks */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="bg-white border border-parchment rounded-2xl p-5">
              <h3 className="font-bold text-navy-700 mb-3 text-sm uppercase tracking-wider">{t("school.tracks.label")}</h3>
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
              <h3 className="font-bold text-navy-700 mb-3 text-sm uppercase tracking-wider">{t("school.cost.label")}</h3>
              <div className={`text-2xl font-heading font-bold mb-1 ${isFree ? "text-emerald-600" : "text-navy-800"}`}>
                {isFree ? t("school.cost.free") : `${school.annualCostMAD[0].toLocaleString("fr-FR")} MAD`}
              </div>
              {!isFree && (
                <p className="text-xs text-navy-400">
                  {t("school.cost.note", { max: school.annualCostMAD[1].toLocaleString("fr-FR") })}
                </p>
              )}
              {isFree && (
                <p className="text-xs text-emerald-600">
                  {t("school.cost.symbolic", { max: school.annualCostMAD[1].toLocaleString("fr-FR") })}
                </p>
              )}
              <div className="mt-4 pt-3 border-t border-parchment">
                <p className="text-xs text-navy-400">
                  {t("school.minhaty")}{" "}
                  <a href="https://www.minhaty.ma" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline">minhaty.ma</a>
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-5 text-white">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold mb-2">{t("school.cta.title")}</h3>
              <p className="text-navy-300 text-xs mb-4 leading-relaxed">
                {t("school.cta.desc")}
              </p>
              <Link
                to="/orientation"
                className="block text-center py-3 px-4 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-gold-500/20 transition-all"
              >
                {t("school.cta.btn")}
              </Link>
            </motion.div>

            {/* Official links */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-white border border-parchment rounded-2xl p-5">
              <h3 className="font-bold text-navy-700 mb-3 text-sm uppercase tracking-wider">{t("school.links.title")}</h3>
              <div className="space-y-2">
                <a href="https://cursussup.gov.ma" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-navy-600 hover:text-gold-600 transition-colors">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {t("school.links.applications")}
                </a>
                <a href="https://www.minhaty.ma" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-navy-600 hover:text-gold-600 transition-colors">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {t("school.links.scholarships")}
                </a>
                {school.website && (
                  <a href={school.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-navy-600 hover:text-gold-600 transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {t("school.official.site")} — {school.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Similar schools */}
        {similarSchools.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-14">
            <h2 className="font-heading text-2xl font-bold text-navy-800 mb-6">{t("school.similar")}</h2>
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
                {t("school.similar.see_all")}
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
