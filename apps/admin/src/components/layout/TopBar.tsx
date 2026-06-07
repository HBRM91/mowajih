import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function TopBar() {
  const [notifications] = useState(3);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 bg-white border-b border-gold-100/50 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        <h1 className="font-heading text-xl font-bold text-navy-800 hidden md:block">Tableau de bord</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2.5 text-navy-400 hover:bg-gold-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

        {/* Logout */}
        {showLogoutConfirm ? (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
            <span className="text-xs text-red-700 font-medium">Déconnexion ?</span>
            <button
              onClick={handleLogout}
              className="text-xs bg-red-600 text-white px-2 py-1 rounded-lg font-bold hover:bg-red-700 transition"
            >
              Oui
            </button>
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="text-xs text-red-500 px-1 py-1 font-medium hover:text-red-700 transition"
            >
              Non
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2.5 text-navy-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
            title="Se déconnecter"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
