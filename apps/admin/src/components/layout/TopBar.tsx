import { useState } from "react";

export default function TopBar() {
  const [notifications] = useState(3);

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
      </div>
    </header>
  );
}
