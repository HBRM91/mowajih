import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useWishlistStore } from "../../stores/wishlistStore";

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
  const wishlistCount = useWishlistStore((s) => s.slugs.length);

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

          {/* Logo — always left */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            {isHome ? (
              <div className="bg-white/90 rounded-lg px-1.5 py-1 transition-all group-hover:bg-white">
                <img src="/logo.png" alt="JAD2 TAWJIH" className="h-8 w-auto object-contain" />
              </div>
            ) : (
              <img src="/logo.png" alt="JAD2 TAWJIH" className="h-9 w-auto object-contain rounded-lg" />
            )}
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
                to="/comparer"
                className={`flex items-center gap-1.5 transition-all duration-200 font-semibold ${
                  pathname === "/comparer"
                    ? "text-gold-500"
                    : isHome
                      ? "text-white/90 hover:text-gold-300"
                      : "text-navy-700 hover:text-gold-600"
                }`}
              >
                <span className="text-sm">⚖</span>
                {t("nav.compare")}
              </Link>
              <Link
                to="/prep"
                className={`flex items-center gap-1 transition-colors duration-200 font-semibold ${
                  pathname.startsWith("/prep")
                    ? "text-gold-500"
                    : isHome ? "text-white/90 hover:text-gold-300" : "text-navy-700 hover:text-gold-600"
                }`}
              >
                📝 Prép Concours
              </Link>
              <Link to="/contact" className={`transition-colors duration-200 ${linkColor}`}>
                {t("nav.contact")}
              </Link>
              {/* Favorites icon */}
              <Link to="/favoris" className={`relative transition-colors duration-200 ${linkColor}`} title="Mes favoris">
                <svg className="w-4 h-4" fill={wishlistCount > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/orientation"
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-full font-bold text-xs hover:shadow-lg hover:shadow-gold-500/25 hover:scale-105 transition-all duration-200"
              >
                <span className="w-1.5 h-1.5 bg-navy-900/50 rounded-full" />
                {t("nav.start")}
              </Link>
              <a
                href="https://admin.tawjih.jad2advisory.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`opacity-35 hover:opacity-65 transition-opacity duration-200 ${linkColor}`}
                title={t("nav.admin_tooltip")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </a>
            </div>

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
          <div dir="ltr" className="md:hidden border-t border-navy-800 bg-navy-900">
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
                to="/comparer"
                className="flex items-center gap-3 py-3 px-4 text-white font-medium rounded-xl bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/15 transition"
                onClick={() => setMenuOpen(false)}
              >
                <span className="w-4 h-4 text-gold-400 text-base flex items-center justify-center">⚖</span>
                {t("nav.compare")}
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 bg-gold-500/20 text-gold-300 rounded-full">{t("home.compare.badge")}</span>
              </Link>
              <Link
                to="/prep"
                className="flex items-center gap-3 py-3 px-4 text-white font-medium rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-base">📝</span>
                Prép Concours
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full">ENSA · ENA · TAFEM</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 py-3 px-4 text-white font-medium rounded-xl hover:bg-white/8 transition"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t("nav.contact")}
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
