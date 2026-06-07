import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function fetchAnalytics() {
  return fetch(`${API_URL}/admin/analytics`, {
    headers: { "CF-Access-JWT-Assertion": localStorage.getItem("tawjih_access_token") || "" },
  }).then((r) => r.json());
}

export default function Dashboard() {
  const { data } = useQuery({ queryKey: ["analytics"], queryFn: fetchAnalytics });
  const kpis = data?.kpis ?? {};

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-navy-800">Tableau de bord</h1>
        <p className="text-navy-400 mt-1">Vue d'ensemble de votre activité de recrutement</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard title="Leads ce mois" value={kpis.leadsThisMonth ?? 0} trend={+12} icon="🎯" />
        <KpiCard title="Taux d'opt-in" value={`${(kpis.optInRate ?? 0).toFixed(1)}%`} trend={+3.2} icon="🔓" />
        <KpiCard title="Revenu potentiel" value={`${(kpis.potentialRevenue ?? 0).toLocaleString()} MAD`} icon="💰" />
        <KpiCard title="Quota restant" value={`${kpis.remainingQuota ?? 0}`} icon="📊" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gold-100/50 shadow-sm">
          <h3 className="font-heading font-bold text-navy-800 mb-5">Accès rapide</h3>
          <div className="space-y-3">
            <QuickLink to="/pipeline" icon="🎯" title="Pipeline" desc="Gérer vos leads et conversions" />
            <QuickLink to="/analytics" icon="📈" title="Analytiques" desc="Rapports et tendances détaillés" />
            <QuickLink to="/communications" icon="✉️" title="Communications" desc="Emails et relances IA" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gold-100/50 shadow-sm">
          <h3 className="font-heading font-bold text-navy-800 mb-5">Nouveaux leads</h3>
          <p className="text-sm text-navy-400">Aperçu des derniers profils reçus</p>
          <div className="mt-4 p-4 bg-cream rounded-2xl text-sm text-navy-400 text-center">
            Connectez-vous pour voir les données en temps réel
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, icon }: { title: string; value: string | number; trend?: number; icon: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gold-100/50 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend !== undefined && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="font-heading text-2xl font-bold text-navy-800">{value}</div>
      <div className="text-xs text-navy-400 mt-1">{title}</div>
    </div>
  );
}

function QuickLink({ to, icon, title, desc }: { to: string; icon: string; title: string; desc: string }) {
  return (
    <Link to={to} className="flex items-center gap-4 p-4 bg-cream rounded-2xl hover:bg-gold-50/50 transition border border-transparent hover:border-gold-100">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="font-semibold text-navy-800 text-sm">{title}</div>
        <div className="text-xs text-navy-400">{desc}</div>
      </div>
    </Link>
  );
}
