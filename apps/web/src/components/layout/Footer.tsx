import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SCHOOLS } from "../../data/schools";

const SCHOOL_CATEGORIES = [
  { label: "Ingénierie publique", slugs: ["emi", "ehtp", "ensias", "inpt", "enim"], icon: "⚙️" },
  { label: "Business & Commerce", slugs: ["iscae", "insea", "encg-casablanca", "hem", "encg-fes"], icon: "📊" },
  { label: "Universités privées", slugs: ["um6p", "uir", "mundiapolis", "al-akhawayn", "emsi"], icon: "🎓" },
  { label: "Médecine & Santé", slugs: ["fm-rabat", "fm-casablanca", "fm-fes", "fm-marrakech", "iav-hassan-ii"], icon: "🏥" },
];

const ADMIN_URL = "https://tawjih-admin.pages.dev";
const CONTACT_EMAIL = "Tawjih@jad2advisory.com";
const PARENT_SITE = "https://jad2advisory.hamzaelbouhali.workers.dev/";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer dir="ltr" className="bg-navy-950 text-white">
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <img
                src="/logo.png"
                alt="JAD2 TAWJIH"
                className="h-11 w-auto object-contain rounded-xl brightness-0 invert ring-1 ring-white/15 group-hover:ring-gold-400/40 transition-all shadow-lg"
              />
              <div>
                <div className="font-heading font-bold text-xl text-gold-300 leading-none">JAD2</div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-gold-500/70 leading-none mt-0.5">TAWJIH</div>
              </div>
            </Link>
            <p className="text-navy-300 text-sm leading-relaxed mb-5">
              Outil d'orientation indépendant pour les bacheliers marocains. Propulsé par l'IA, basé sur les données officielles Tawjihi et cursussup. Non affilié aux établissements présentés.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-navy-400">
                <span className="text-emerald-400">✓</span>
                Conforme CNDP — Données anonymisées
              </div>
              <div className="flex items-center gap-2 text-xs text-navy-400">
                <span className="text-emerald-400">✓</span>
                100% Gratuit pour les étudiants
              </div>
              <div className="flex items-center gap-2 text-xs text-navy-400">
                <span className="text-emerald-400">✓</span>
                Disponible en FR · AR · EN
              </div>
            </div>
          </div>

          {/* Etablissements */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-gold-300 mb-5 text-sm uppercase tracking-wider">
              Établissements analysés
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SCHOOL_CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-navy-300 uppercase tracking-wider mb-2">
                    <span>{cat.icon}</span>
                    {cat.label}
                  </div>
                  <div className="space-y-1.5">
                    {cat.slugs.map((slug) => {
                      const school = SCHOOLS.find((s) => s.slug === slug);
                      if (!school) return null;
                      return (
                        <Link
                          key={slug}
                          to={`/ecoles/${slug}`}
                          className="flex items-center gap-2 text-xs text-navy-400 hover:text-gold-300 transition-colors group"
                        >
                          <span className="w-1 h-1 bg-navy-600 group-hover:bg-gold-400 rounded-full transition-colors flex-shrink-0" />
                          <span>{school.shortName}</span>
                          <span className="text-navy-600 group-hover:text-navy-500">— {school.city}</span>
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    to="/ecoles"
                    className="mt-2 text-[10px] text-navy-600 hover:text-gold-500 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    {t("footer.schools.link")}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation + Contact */}
          <div>
            <h4 className="font-heading font-bold text-gold-300 mb-5 text-sm uppercase tracking-wider">Navigation</h4>
            <div className="space-y-2 mb-8">
              <Link to="/" className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors group">
                <span className="w-1 h-1 bg-navy-600 group-hover:bg-gold-400 rounded-full transition-colors" />
                {t("nav.home")}
              </Link>
              <Link to="/orientation" className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors group">
                <span className="w-1 h-1 bg-navy-600 group-hover:bg-gold-400 rounded-full transition-colors" />
                {t("nav.orientation")}
              </Link>
              <Link to="/ecoles" className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors group">
                <span className="w-1 h-1 bg-navy-600 group-hover:bg-gold-400 rounded-full transition-colors" />
                {t("footer.nav.schools")}
              </Link>
              <Link to="/privacy" className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors group">
                <span className="w-1 h-1 bg-navy-600 group-hover:bg-gold-400 rounded-full transition-colors" />
                {t("nav.privacy")}
              </Link>
            </div>

            <a
              href={ADMIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-navy-600 hover:text-navy-400 transition-colors mt-1 mb-6"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Espace partenaires
            </a>

            <h4 className="font-heading font-bold text-gold-300 mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {CONTACT_EMAIL}
              </a>
              <a
                href={PARENT_SITE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
                JAD2 Advisory (site parent)
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-navy-800 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: SCHOOLS.length + "+", label: t("stats.schools") },
              { value: "12", label: t("stats.regions") },
              { value: "7", label: t("stats.tracks") },
              { value: "3", label: "Langues" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-heading text-2xl font-bold text-gold-400">{s.value}</div>
                <div className="text-xs text-navy-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-navy-500">
            © {new Date().getFullYear()} JAD2 TAWJIH · Division Éducation de JAD2 Advisory. Tous droits réservés.
          </span>
          <div className="flex items-center gap-4 text-xs text-navy-500">
            <Link to="/privacy" className="hover:text-navy-300 transition">{t("nav.privacy")}</Link>
            <span>·</span>
            <span>Conforme CNDP</span>
            <span>·</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-navy-300 transition">{CONTACT_EMAIL}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
