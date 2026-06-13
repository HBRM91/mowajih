import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import XPBar from "../gamification/XPBar";

const languages = [
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  const isHome = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = code;
  };

  const navBg = isHome
    ? scrolled
      ? "bg-navy-900/95 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-navy-950/20"
      : "bg-navy-950/50 backdrop-blur-md"
    : "bg-cream/95 backdrop-blur-xl border-b border-gold-100/50 shadow-sm";

  const linkColor = isHome ? "text-white/85 hover:text-gold-300" : "text-navy-700 hover:text-gold-600";

  return (
    <>
      {/* dir="ltr" forces left-to-right layout regardless of page RTL direction */}
      <nav dir="ltr" className={`sticky top-0 z-40 transition-all duration-500 ${navBg}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo — always left, white filter on dark bg */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <img
              src="/logo.png"
              alt="JAD2 TAWJIH"
              className={`h-9 w-auto object-contain rounded-lg transition-all shadow-md ${
                isHome
                  ? "brightness-0 invert ring-1 ring-white/20 group-hover:ring-gold-400/50"
                  : "ring-1 ring-gold-400/30 group-hover:ring-gold-400/60"
              }`}
            />
          </Link>

          {/* Desktop nav — always LTR order */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-5 text-sm font-medium">
              <Link to="/" className={`transition-colors duration-200 ${linkColor}`}>
                {t("nav.home")}
              </Link>
              <Link to="/orientation" className={`transition-colors duration-200 ${linkColor}`}>
                {t("nav.orientation")}
              </Link>
              <Link to="/ecoles" className={`transition-colors duration-200 ${linkColor}`}>
                {t("nav.schools")}
              </Link>
              <Link
                to="/orientation"
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold text-xs hover:shadow-lg hover:shadow-gold-500/25 hover:scale-105 transition-all duration-200"
              >
                <span className="w-1.5 h-1.5 bg-navy-900/50 rounded-full" />
                {t("nav.start")}
              </Link>
              <a
                href="https://tawjih-admin.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`opacity-35 hover:opacity-65 transition-opacity duration-200 ${linkColor}`}
                title="Admin"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </a>
            </div>

            <XPBar />

            {/* Language selector — always LTR */}
            <div dir="ltr" className="flex items-center gap-0.5 bg-navy-800/25 backdrop-blur-sm rounded-full p-0.5 border border-white/10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLang(lang.code)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-200 ${
                    i18n.language === lang.code
                      ? "bg-gold-500 text-navy-900 shadow-sm"
                      : isHome
                        ? "text-white/60 hover:text-white"
                        : "text-navy-500 hover:text-navy-800"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${isHome ? "text-white hover:bg-white/10" : "text-navy-700 hover:bg-navy-50"}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu — always LTR layout */}
        {menuOpen && (
          <div dir="ltr" className="md:hidden border-t border-white/10 bg-navy-900/98 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 py-3 px-4 text-white font-medium rounded-xl hover:bg-white/8 transition"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t("nav.home")}
              </Link>
              <Link
                to="/orientation"
                className="flex items-center gap-3 py-3 px-4 text-white font-medium rounded-xl hover:bg-white/8 transition"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {t("nav.orientation")}
              </Link>
              <Link
                to="/ecoles"
                className="flex items-center gap-3 py-3 px-4 text-white font-medium rounded-xl hover:bg-white/8 transition"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {t("nav.schools")}
              </Link>
              <Link
                to="/privacy"
                className="flex items-center gap-3 py-3 px-4 text-white/70 text-sm rounded-xl hover:bg-white/8 transition"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4 text-gold-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t("nav.privacy")}
              </Link>
              <div className="pt-3 border-t border-white/10">
                <Link
                  to="/orientation"
                  className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-xl font-bold text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  🚀 {t("nav.start.mobile")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
