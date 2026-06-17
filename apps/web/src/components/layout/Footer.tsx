import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SCHOOLS } from "../../data/schools";

const SCHOOL_CATEGORIES = [
  { labelKey: "footer.cat.engineering", slugs: ["emi", "ehtp", "ensias", "inpt", "enim"], icon: "⚙️" },
  { labelKey: "footer.cat.business", slugs: ["iscae", "insea", "encg-casablanca", "hem", "encg-fes"], icon: "📊" },
  { labelKey: "footer.cat.private_uni", slugs: ["um6p", "uir", "mundiapolis", "al-akhawayn", "emsi"], icon: "🎓" },
  { labelKey: "footer.cat.medicine", slugs: ["fm-rabat", "fm-casablanca", "fm-fes", "fm-marrakech", "iav-hassan-ii"], icon: "🏥" },
];

const CONTACT_EMAIL = "Tawjih@jad2advisory.com";
const PARENT_SITE = "https://jad2advisory.com/";

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
              <div className="bg-white/90 rounded-xl px-2 py-1.5 transition-all group-hover:bg-white">
                <img src="/logo.png" alt="JAD2 TAWJIH" className="h-9 w-auto object-contain" />
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-gold-300 leading-none">JAD2</div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-gold-500/70 leading-none mt-0.5">TAWJIH</div>
              </div>
            </Link>
            <p className="text-navy-300 text-sm leading-relaxed mb-5">
              {t("footer.brand.desc")}
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-navy-400">
                <span className="text-emerald-400">✓</span>
                {t("footer.trust.cndp")}
              </div>
              <div className="flex items-center gap-2 text-xs text-navy-400">
                <span className="text-emerald-400">✓</span>
                {t("footer.trust.free")}
              </div>
              <div className="flex items-center gap-2 text-xs text-navy-400">
                <span className="text-emerald-400">✓</span>
                {t("footer.trust.languages")}
              </div>
            </div>
          </div>

          {/* Etablissements */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-gold-300 mb-5 text-sm uppercase tracking-wider">
              {t("footer.schools.heading")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SCHOOL_CATEGORIES.map((cat) => (
                <div key={cat.labelKey}>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-navy-300 uppercase tracking-wider mb-2">
                    <span>{cat.icon}</span>
                    {t(cat.labelKey)}
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
            <h4 className="font-heading font-bold text-gold-300 mb-5 text-sm uppercase tracking-wider">{t("footer.nav.heading")}</h4>
            <div className="space-y-2 mb-8">
              <Link to="/" className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors group">
                <span className="w-1 h-1 bg-navy-600 group-hover:bg-gold-400 rounded-full transition-colors" />
                {t("nav.home")}
              </Link>
              <Link to="/orientation" className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors group">
                <span className="w-1 h-1 bg-navy-600 group-hover:bg-gold-400 rounded-full transition-colors" />
                {t("nav.orientation")}
              </Link>
              <Link to="/comparer" className="flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors group font-semibold">
                <span className="text-xs">⚖</span>
                {t("footer.nav.compare")}
              </Link>
              <Link to="/ecoles" className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors group">
                <span className="w-1 h-1 bg-navy-600 group-hover:bg-gold-400 rounded-full transition-colors" />
                {t("footer.nav.schools")}
              </Link>
              <Link to="/privacy" className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors group">
                <span className="w-1 h-1 bg-navy-600 group-hover:bg-gold-400 rounded-full transition-colors" />
                {t("nav.privacy")}
              </Link>
              <Link to="/contact" className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors group">
                <span className="w-1 h-1 bg-navy-600 group-hover:bg-gold-400 rounded-full transition-colors" />
                {t("nav.contact")}
              </Link>
            </div>

            <h4 className="font-heading font-bold text-gold-300 mb-4 text-sm uppercase tracking-wider">{t("footer.contact.heading")}</h4>
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
                {t("footer.parent_site")}
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
              { value: "3", label: t("stats.languages") },
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
            © {new Date().getFullYear()} JAD2 TAWJIH · {t("footer.copyright")}
          </span>
          <div className="flex items-center gap-4 text-xs text-navy-500">
            <Link to="/privacy" className="hover:text-navy-300 transition">{t("nav.privacy")}</Link>
            <span>·</span>
            <span>{t("footer.cndp_badge")}</span>
            <span>·</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-navy-300 transition">{CONTACT_EMAIL}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
