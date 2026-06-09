import { Link } from "react-router-dom";
import { SCHOOLS } from "../../data/schools";

const SCHOOL_CATEGORIES = [
  { label: "Ingénierie publique", slugs: ["emi", "ehtp", "ensias", "inpt", "enim"], icon: "⚙️" },
  { label: "Business & Commerce", slugs: ["iscae", "insea", "encg-casablanca", "hem", "encg-fes"], icon: "📊" },
  { label: "Universités privées", slugs: ["um6p", "uir", "mundiapolis", "al-akhawayn", "upf"], icon: "🎓" },
  { label: "Médecine & Santé", slugs: ["fm-rabat", "fm-casablanca", "fm-fes", "fm-marrakech", "iav-hassan-ii"], icon: "🏥" },
];

const QUICK_LINKS = [
  { label: "Accueil", to: "/" },
  { label: "Mon orientation", to: "/orientation" },
  { label: "Politique de confidentialité", to: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/logo.png"
                alt="JAD2 TAWJIH"
                className="h-12 w-auto object-contain rounded-xl ring-1 ring-gold-400/30 shadow-lg"
              />
              <div>
                <div className="font-heading font-bold text-xl text-gold-300 leading-none">JAD2</div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-gold-500/70 leading-none mt-0.5">TAWJIH</div>
              </div>
            </div>
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
                  <div className="space-y-1">
                    {cat.slugs.map((slug) => {
                      const school = SCHOOLS.find((s) => s.slug === slug);
                      if (!school) return null;
                      return (
                        <div key={slug} className="flex items-center gap-2 text-xs text-navy-400 hover:text-gold-300 transition-colors cursor-default">
                          <span className="w-1 h-1 bg-navy-600 rounded-full" />
                          {school.shortName}
                          <span className="text-navy-600">— {school.city}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation + Contact */}
          <div>
            <h4 className="font-heading font-bold text-gold-300 mb-5 text-sm uppercase tracking-wider">Navigation</h4>
            <div className="space-y-2 mb-8">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors group"
                >
                  <span className="w-1 h-1 bg-navy-600 group-hover:bg-gold-400 rounded-full transition-colors" />
                  {link.label}
                </Link>
              ))}
            </div>

            <h4 className="font-heading font-bold text-gold-300 mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-2">
              <a
                href="mailto:contact@jad2tawjih.ma"
                className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@jad2tawjih.ma
              </a>
              <a
                href="https://jad2advisory.hamzaelbouhali.workers.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-navy-300 hover:text-gold-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              { value: SCHOOLS.length + "+", label: "Établissements référencés" },
              { value: "12", label: "Régions couvertes" },
              { value: "7", label: "Filières Bac" },
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
            <Link to="/privacy" className="hover:text-navy-300 transition">Confidentialité</Link>
            <span>·</span>
            <span>Conforme CNDP</span>
            <span>·</span>
            <span>Données anonymisées</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
