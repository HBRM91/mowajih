import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = new URLSearchParams(window.location.search).get("token");
    if (jwt) {
      localStorage.setItem("tawjih_access_token", jwt);
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-navy-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm p-8 bg-cream rounded-3xl shadow-2xl border border-gold-200/30 text-center">
        <img src="/logo.png" alt="JAD2 TAWJIH" className="h-16 w-auto mx-auto mb-4 object-contain rounded" />
        <h1 className="font-heading text-2xl font-bold text-navy-800 mb-1">JAD2 TAWJIH</h1>
        <p className="text-navy-400 text-sm mb-8">Dashboard Conseiller — Accès réservé</p>
        <a
          href="/cdn-cgi/access/login"
          className="block w-full py-3.5 bg-gradient-to-r from-navy-700 to-navy-800 text-gold-200 rounded-xl font-semibold hover:from-navy-800 hover:to-navy-900 transition shadow-lg"
        >
          Se connecter avec Cloudflare Access
        </a>
      </div>
    </div>
  );
}
