import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { apiGet } from "../lib/api";

const TRACK_COLORS: Record<string, string> = {
  SM: "bg-blue-100 text-blue-800", PC: "bg-indigo-100 text-indigo-800",
  SVT: "bg-emerald-100 text-emerald-800", SE: "bg-amber-100 text-amber-800",
  SH: "bg-rose-100 text-rose-800", STI: "bg-slate-100 text-slate-800", L: "bg-purple-100 text-purple-800",
};
const MENTION_COLORS: Record<string, string> = {
  "Très Bien": "text-emerald-700 bg-emerald-50 border-emerald-200",
  "Bien": "text-blue-700 bg-blue-50 border-blue-200",
  "Assez Bien": "text-amber-700 bg-amber-50 border-amber-200",
  "Passable": "text-rose-700 bg-rose-50 border-rose-200",
};
const BUDGET_LABELS: Record<string, string> = {
  "<<3000": "< 3 000 MAD", "3000-8000": "3 000–8 000 MAD",
  "8000-15000": "8 000–15 000 MAD", ">15000": "> 15 000 MAD",
};

interface PlatformData {
  funnel: { simulations: number; leads: number; optIns: number; contacts: number; converted: number; simToLead: number; leadToOptIn: number; optInToConverted: number };
  schoolDemand: Array<{ schoolSlug: string; count: number; avgProbability: number }>;
  trackDist: Array<{ bacTrack: string; count: number; avgGrade: number }>;
  regionDist: Array<{ region: string; count: number }>;
  budgetDist: Array<{ bracket: string; count: number }>;
  trend30d: Array<{ day: string; count: number }>;
  recentProfiles: Array<{ uuid: string; bacTrack: string; mention: string; city: string; generalGrade: number; financialBracket: string; createdAt: string }>;
  monthlyRevenue: Array<{ month: string; revenue: number; optIns: number; leads: number }>;
  mentionDist: Array<{ mention: string; count: number }>;
}

function fmt(n: number) { return n.toLocaleString("fr-MA"); }
function pct(a: number, b: number) { return b ? Math.round((a / b) * 100) : 0; }

export default function Dashboard() {
  const { data, isLoading } = useQuery<PlatformData>({
    queryKey: ["platform-analytics"],
    queryFn: () => apiGet("/api/admin/analytics/platform"),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Bonjour" : now.getHours() < 18 ? "Bon après-midi" : "Bonsoir";
  const dateStr = now.toLocaleDateString("fr-MA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const f = data?.funnel;
  const totalRevenue = data?.monthlyRevenue?.reduce((s, m) => s + (m.revenue ?? 0), 0) ?? 0;
  const maxDemand = Math.max(...(data?.schoolDemand?.map((s) => s.count) ?? [1]));
  const maxRegion = Math.max(...(data?.regionDist?.map((r) => r.count) ?? [1]));

  return (
    <div className="space-y-6 max-w-7xl">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy-800">{greeting} 👋</h1>
          <p className="text-navy-400 mt-1 capitalize">{dateStr} · JAD2 Advisory — Tableau de bord</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Données en temps réel
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Simulations", value: f?.simulations, sub: "Total étudiants", icon: "🎓", color: "from-navy-700 to-navy-800", text: "text-white" },
          { label: "Leads générés", value: f?.leads, sub: `${f?.simToLead ?? 0}% des simulations`, icon: "🎯", color: "from-gold-500 to-gold-600", text: "text-navy-900" },
          { label: "Opt-ins", value: f?.optIns, sub: `${f?.leadToOptIn ?? 0}% des leads`, icon: "🔓", color: "from-emerald-500 to-emerald-600", text: "text-white" },
          { label: "Avec contact", value: f?.contacts, sub: "Profils identifiés", icon: "👤", color: "from-blue-500 to-blue-600", text: "text-white" },
          { label: "Convertis", value: f?.converted, sub: `${f?.optInToConverted ?? 0}% des opt-ins`, icon: "✅", color: "from-purple-600 to-purple-700", text: "text-white" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`bg-gradient-to-br ${kpi.color} rounded-2xl p-5 shadow-sm`}
          >
            <div className="text-2xl mb-3">{kpi.icon}</div>
            <div className={`font-heading text-3xl font-bold ${kpi.text}`}>
              {isLoading ? "—" : fmt(kpi.value ?? 0)}
            </div>
            <div className={`text-xs font-bold mt-0.5 ${kpi.text} opacity-90`}>{kpi.label}</div>
            <div className={`text-[11px] mt-1 ${kpi.text} opacity-60`}>{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Funnel + Revenue ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Conversion funnel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gold-100/60 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-navy-800">Entonnoir de conversion</h2>
            <span className="text-xs text-navy-400 bg-navy-50 px-2.5 py-1 rounded-full">Plateforme entière</span>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Simulations totales", value: f?.simulations ?? 0, max: f?.simulations ?? 1, color: "bg-navy-700" },
              { label: "Leads générés", value: f?.leads ?? 0, max: f?.simulations ?? 1, color: "bg-gold-500" },
              { label: "Opt-ins (accord contact)", value: f?.optIns ?? 0, max: f?.simulations ?? 1, color: "bg-emerald-500" },
              { label: "Contacts identifiés", value: f?.contacts ?? 0, max: f?.simulations ?? 1, color: "bg-blue-500" },
              { label: "Convertis (école contactée)", value: f?.converted ?? 0, max: f?.simulations ?? 1, color: "bg-purple-600" },
            ].map((step, i) => (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-navy-600 font-medium">{step.label}</span>
                  <span className="font-bold text-navy-800">{fmt(step.value)} <span className="text-navy-400 font-normal">({pct(step.value, f?.simulations ?? 1)}%)</span></span>
                </div>
                <div className="h-6 bg-navy-50 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct(step.value, step.max)}%` }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                    className={`h-full ${step.color} rounded-lg flex items-center pl-2`}
                  >
                    {pct(step.value, step.max) > 8 && (
                      <span className="text-white text-[10px] font-bold">{pct(step.value, step.max)}%</span>
                    )}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-6 text-white shadow-sm">
          <h2 className="font-heading font-bold text-gold-300 mb-1">Revenu plateforme</h2>
          <p className="text-navy-400 text-xs mb-5">Cumul des opt-ins facturés</p>
          <div className="font-heading text-4xl font-bold text-white mb-1">
            {fmt(totalRevenue)} <span className="text-lg text-gold-400">MAD</span>
          </div>
          <p className="text-navy-400 text-xs mb-6">Derniers 6 mois · {data?.monthlyRevenue?.reduce((s, m) => s + (m.optIns ?? 0), 0) ?? 0} opt-ins facturés</p>
          <div className="space-y-2">
            {(data?.monthlyRevenue ?? []).slice(-3).map((m) => (
              <div key={m.month} className="flex items-center justify-between text-xs">
                <span className="text-navy-400">{m.month}</span>
                <div className="flex items-center gap-2">
                  <span className="text-navy-300">{m.leads} leads</span>
                  <span className="text-gold-400 font-bold">{fmt(m.revenue ?? 0)} MAD</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/analytics" className="mt-5 block text-center text-xs text-gold-400 hover:text-gold-300 transition font-medium">
            Voir analytiques complètes →
          </Link>
        </div>
      </div>

      {/* ── 30-day Trend + School Demand ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Simulations trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gold-100/60 p-6 shadow-sm">
          <h2 className="font-heading font-bold text-navy-800 mb-4">Simulations — 30 derniers jours</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data?.trend30d ?? []}>
              <defs>
                <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A962" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A962" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F3EE" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8196BA" }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: "#8196BA" }} width={28} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #F5F3EE", fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="#C9A962" strokeWidth={2} fillOpacity={1} fill="url(#simGrad)" name="Simulations" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top demanded schools */}
        <div className="bg-white rounded-2xl border border-gold-100/60 p-6 shadow-sm">
          <h2 className="font-heading font-bold text-navy-800 mb-4">Écoles les + demandées</h2>
          <div className="space-y-2.5">
            {(data?.schoolDemand ?? []).slice(0, 7).map((s, i) => (
              <div key={s.schoolSlug} className="flex items-center gap-2">
                <span className="text-[11px] text-navy-400 w-4 font-bold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-navy-700 uppercase tracking-wide truncate">{s.schoolSlug.replace(/-/g, " ")}</span>
                    <span className="text-[10px] text-navy-400 ml-1 flex-shrink-0">{s.count}</span>
                  </div>
                  <div className="h-1.5 bg-navy-50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.count / maxDemand) * 100}%` }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold flex-shrink-0">{s.avgProbability}%</span>
              </div>
            ))}
          </div>
          <Link to="/analytics" className="mt-4 block text-center text-xs text-gold-600 hover:text-gold-700 transition font-medium">
            Voir toutes les demandes →
          </Link>
        </div>
      </div>

      {/* ── Track + Region + Recent Profiles ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bac tracks */}
        <div className="bg-white rounded-2xl border border-gold-100/60 p-6 shadow-sm">
          <h2 className="font-heading font-bold text-navy-800 mb-4">Filières Bac</h2>
          <div className="space-y-2">
            {(data?.trackDist ?? []).map((t) => {
              const total = data?.trackDist?.reduce((s, x) => s + x.count, 0) ?? 1;
              return (
                <div key={t.bacTrack} className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${TRACK_COLORS[t.bacTrack] ?? "bg-gray-100 text-gray-700"} flex-shrink-0 w-8 text-center`}>
                    {t.bacTrack}
                  </span>
                  <div className="flex-1 h-2 bg-navy-50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct(t.count, total)}%` }}
                      transition={{ duration: 0.7 }}
                      className="h-full bg-navy-600 rounded-full"
                    />
                  </div>
                  <span className="text-[11px] text-navy-500 w-8 text-right">{pct(t.count, total)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top regions */}
        <div className="bg-white rounded-2xl border border-gold-100/60 p-6 shadow-sm">
          <h2 className="font-heading font-bold text-navy-800 mb-4">Régions actives</h2>
          <div className="space-y-2">
            {(data?.regionDist ?? []).slice(0, 7).map((r) => (
              <div key={r.region} className="flex items-center gap-2">
                <span className="text-[10px] text-navy-500 flex-shrink-0 w-20 truncate">{r.region}</span>
                <div className="flex-1 h-2 bg-navy-50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(r.count / maxRegion) * 100}%` }}
                    transition={{ duration: 0.7 }}
                    className="h-full bg-gold-500 rounded-full"
                  />
                </div>
                <span className="text-[11px] font-bold text-navy-600 w-6 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent profiles */}
        <div className="bg-white rounded-2xl border border-gold-100/60 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-navy-800">Profils récents</h2>
            <Link to="/profiles" className="text-xs text-gold-600 hover:text-gold-700 font-medium">Voir tous →</Link>
          </div>
          <div className="space-y-2.5">
            {(data?.recentProfiles ?? []).map((p) => (
              <Link
                key={p.uuid}
                to={`/profiles/${p.uuid}`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-navy-50/50 transition group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-navy-700 to-navy-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-gold-300 text-xs font-heading font-bold">{p.bacTrack}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${MENTION_COLORS[p.mention] ?? "text-gray-600 bg-gray-50 border-gray-200"}`}>
                      {p.mention?.slice(0, 2) ?? "??"}
                    </span>
                    <span className="text-xs text-navy-700 font-semibold">{p.generalGrade ?? "—"}/20</span>
                  </div>
                  <div className="text-[11px] text-navy-400 truncate mt-0.5">{p.city} · {BUDGET_LABELS[p.financialBracket] ?? p.financialBracket}</div>
                </div>
                <svg className="w-4 h-4 text-navy-300 group-hover:text-gold-500 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: "/profiles", icon: "👤", label: "Profils étudiants", color: "border-blue-200 hover:bg-blue-50" },
          { to: "/pipeline", icon: "🎯", label: "Pipeline leads", color: "border-gold-200 hover:bg-gold-50" },
          { to: "/communications", icon: "✉️", label: "Communications IA", color: "border-emerald-200 hover:bg-emerald-50" },
          { to: "/seuils", icon: "🎚️", label: "Seuils & frais", color: "border-purple-200 hover:bg-purple-50" },
        ].map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className={`flex items-center gap-3 p-4 bg-white rounded-xl border-2 ${a.color} transition group`}
          >
            <span className="text-xl">{a.icon}</span>
            <span className="text-sm font-semibold text-navy-700">{a.label}</span>
            <svg className="w-4 h-4 text-navy-300 group-hover:translate-x-0.5 transition-transform ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
