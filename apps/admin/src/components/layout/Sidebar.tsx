import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const nav = [
  { path: "/", label: "Tableau de bord", icon: "📊" },
  { path: "/profiles", label: "Profils Étudiants", icon: "👤" },
  { path: "/seuils", label: "Seuils & Frais", icon: "🎚️" },
  { path: "/pipeline", label: "Pipeline", icon: "🎯" },
  { path: "/analytics", label: "Analytiques", icon: "📈" },
  { path: "/communications", label: "Communications", icon: "✉️" },
  { path: "/settings", label: "Paramètres", icon: "⚙️" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        title="Ouvrir le menu"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded-xl shadow border border-gold-100"
      >
        <svg className="w-5 h-5 text-navy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-navy-900 text-white transform transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6 border-b border-navy-800">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="JAD2 TAWJIH" className="h-10 w-auto object-contain rounded" />
            <div>
              <div className="font-heading font-bold text-xl text-gold-300">JAD2</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-gold-500/70">TAWJIH</div>
            </div>
          </Link>
          <p className="text-navy-400 text-xs mt-3">Dashboard Conseiller</p>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                pathname === item.path
                  ? "bg-gold-500/15 text-gold-300 border border-gold-500/20"
                  : "text-navy-200 hover:bg-navy-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-navy-900 text-xs font-bold">
              D
            </div>
            <div>
              <div className="text-sm font-medium text-white">Doyen</div>
              <div className="text-xs text-navy-400">Université Mundiapolis</div>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-navy-950/50 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
