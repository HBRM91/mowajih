import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const API_URL = import.meta.env.VITE_API_URL || "https://tawjih-api.hamzaelbouhali.workers.dev";
const MAX_PASSWORD_LENGTH = 128;

export default function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [email, setEmail] = useState("admin@jad2advisory.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  // Focus password on mount
  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Veuillez saisir un mot de passe.");
      return;
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      setError("Mot de passe trop long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        credentials: "omit",
      });

      const data = await res.json() as { token?: string; error?: string };

      if (!res.ok || !data.token) {
        setAttempts((n) => n + 1);
        if (res.status === 429) {
          setError("Trop de tentatives échouées. Réessayez dans 15 minutes.");
        } else {
          setError(data.error ?? "Authentification échouée.");
        }
        setPassword("");
        passwordRef.current?.focus();
        return;
      }

      setToken(data.token);
      navigate("/", { replace: true });
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }

  const isLocked = attempts >= 5;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-16 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-16 left-16 w-96 h-96 bg-navy-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gold-200/30 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />

          <div className="p-8">
            {/* Logo + Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <img
                  src="/logo.png"
                  alt="JAD2 TAWJIH"
                  className="h-14 w-14 object-contain rounded-2xl shadow-md"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <h1 className="font-heading text-2xl font-bold text-navy-900 tracking-tight">
                JAD2 TAWJIH
              </h1>
              <p className="text-navy-400 text-sm mt-1">
                Dashboard Administrateur
              </p>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-navy-300">
                <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Accès réservé — Connexion sécurisée
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              <div className="mb-4">
                <label htmlFor="email" className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-2">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jad2advisory.com"
                  disabled={loading || isLocked}
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl border-2 border-navy-100 bg-navy-50/50 text-navy-800 placeholder-navy-300 focus:outline-none focus:border-gold-400 focus:bg-white transition-all text-sm disabled:opacity-50"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="block text-xs font-bold text-navy-600 uppercase tracking-widest mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value.slice(0, MAX_PASSWORD_LENGTH))}
                    placeholder="••••••••••••"
                    disabled={loading || isLocked}
                    autoComplete="current-password"
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 border-navy-100 bg-navy-50/50 text-navy-800 placeholder-navy-300 focus:outline-none focus:border-gold-400 focus:bg-white transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-600 transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? "Masquer" : "Afficher"}
                  >
                    {showPassword ? (
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Remaining attempts warning */}
              {attempts >= 3 && !isLocked && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                  ⚠️ {5 - attempts} tentative{5 - attempts > 1 ? "s" : ""} restante{5 - attempts > 1 ? "s" : ""} avant blocage temporaire.
                </div>
              )}

              <button
                type="submit"
                disabled={loading || isLocked || !password}
                className="w-full py-3.5 bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 rounded-xl font-bold text-sm hover:from-navy-800 hover:to-navy-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-navy-900/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Vérification...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Se connecter
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-navy-50/50 border-t border-navy-100 text-center">
            <p className="text-[11px] text-navy-300">
              JAD2 Advisory · Espace réservé aux conseillers autorisés
            </p>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-[11px] text-navy-500/70 mt-4">
          Connexion chiffrée HTTPS · Session 8h · 5 tentatives max
        </p>
      </div>
    </div>
  );
}
