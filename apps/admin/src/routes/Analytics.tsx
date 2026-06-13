import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend,
  Line,
} from "recharts";
import { apiGet } from "../lib/api";

const TRACK_PALETTE: Record<string, string> = {
  SM: "#1B365D", PC: "#3B4FA8", SVT: "#059669", SE: "#D97706",
  SH: "#E11D48", STI: "#475569", L: "#7C3AED",
};
const MENTION_PALETTE: Record<string, string> = {
  "Très Bien": "#059669", "Bien": "#1B365D", "Assez Bien": "#D97706", "Passable": "#E11D48",
};
const BUDGET_ORDER = ["<<3000", "3000-8000", "8000-15000", ">15000"];
const BUDGET_LABELS: Record<string, string> = {
  "<<3000": "< 3k", "3000-8000": "3k–8k", "8000-15000": "8k–15k", ">15000": "> 15k",
};

const TABS = [
  { id: "market", label: "Marché", icon: "🌍" },
  { id: "demand", label: "Demande Écoles", icon: "🏛️" },
  { id: "profiles", label: "Profils", icon: "👤" },
  { id: "revenue", label: "Business", icon: "💰" },
];

interface PlatformData {
  funnel: { simulations: number; leads: number; optIns: number; contacts: number; converted: number; simToLead: number; leadToOptIn: number; optInToConverted: number };
  schoolDemand: Array<{ schoolSlug: string; count: number; avgProbability: number }>;
  trackDist: Array<{ bacTrack: string; count: number; avgGrade: number }>;
  regionDist: Array<{ region: string; count: number }>;
  budgetDist: Array<{ bracket: string; count: number }>;
  trend30d: Array<{ day: string; count: number }>;
  mentionDist: Array<{ mention: string; count: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number; optIns: number; leads: number }>;
  leadStatusDist: Array<{ status: string; count: number }>;
}

function ChartCard({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gold-100/60 p-6 shadow-sm ${className}`}>
      <div className="mb-4">
        <h3 className="font-heading font-bold text-navy-800">{title}</h3>
        {subtitle && <p className="text-xs text-navy-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function StatBox({ label, value, sub, color = "text-navy-800" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-navy-50/60 rounded-xl p-4">
      <div className={`font-heading text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs font-semibold text-navy-600 mt-0.5">{label}</div>
      {sub && <div className="text-[11px] text-navy-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function Analytics() {
  const [tab, setTab] = useState("market");

  const { data, isLoading } = useQuery<PlatformData>({
    queryKey: ["platform-analytics"],
    queryFn: () => apiGet("/api/admin/analytics/platform"),
    staleTime: 60_000,
  });

  const f = data?.funnel;
  const totalRevenue = data?.monthlyRevenue?.reduce((s, m) => s + (m.revenue ?? 0), 0) ?? 0;
  const totalOptIns = data?.monthlyRevenue?.reduce((s, m) => s + (m.optIns ?? 0), 0) ?? 0;
  const avgRevPerOptIn = totalOptIns ? Math.round(totalRevenue / totalOptIns) : 0;

  const trackData = (data?.trackDist ?? []).map((t) => ({
    ...t,
    fill: TRACK_PALETTE[t.bacTrack] ?? "#8196BA",
  }));

  const mentionData = (data?.mentionDist ?? []).map((m) => ({
    ...m,
    fill: MENTION_PALETTE[m.mention] ?? "#8196BA",
  }));

  const budgetData = BUDGET_ORDER
    .map((key) => ({ bracket: BUDGET_LABELS[key] ?? key, count: data?.budgetDist?.find((b) => b.bracket === key)?.count ?? 0 }))
    .filter((b) => b.count > 0);

  const funnelData = [
    { name: "Simulations", value: f?.simulations ?? 0, fill: "#1B365D" },
    { name: "Leads", value: f?.leads ?? 0, fill: "#C9A962" },
    { name: "Opt-ins", value: f?.optIns ?? 0, fill: "#059669" },
    { name: "Contacts", value: f?.contacts ?? 0, fill: "#3B82F6" },
    { name: "Convertis", value: f?.converted ?? 0, fill: "#7C3AED" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy-800">Business Intelligence</h1>
          <p className="text-navy-400 text-sm mt-1">Analyse complète de la plateforme JAD2 TAWJIH</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-navy-50 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id
                ? "bg-white text-navy-800 shadow-sm border border-gold-100"
                : "text-navy-500 hover:text-navy-700"
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: MARKET ── */}
      {tab === "market" && (
        <div className="space-y-5">
          {/* Funnel summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {funnelData.map((step) => (
              <div key={step.name} className="bg-white rounded-xl border border-gold-100/60 p-4 text-center shadow-sm">
                <div className="font-heading text-2xl font-bold" style={{ color: step.fill }}>{step.value.toLocaleString()}</div>
                <div className="text-xs text-navy-500 mt-0.5">{step.name}</div>
                <div className="text-[11px] text-navy-300 mt-1">{f?.simulations ? Math.round((step.value / f.simulations) * 100) : 0}% du total</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 30-day trend */}
            <ChartCard title="Simulations quotidiennes" subtitle="30 derniers jours" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data?.trend30d ?? []}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B365D" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#1B365D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F3EE" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8196BA" }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 11, fill: "#8196BA" }} width={30} />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #F5F3EE", fontSize: 12 }} />
                  <Area type="monotone" dataKey="count" stroke="#1B365D" strokeWidth={2.5} fillOpacity={1} fill="url(#trendGrad)" name="Simulations" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Regions */}
            <ChartCard title="Distribution géographique" subtitle="Étudiants par région">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data?.regionDist ?? []} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F3EE" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#8196BA" }} />
                  <YAxis dataKey="region" type="category" tick={{ fontSize: 10, fill: "#8196BA" }} width={100} />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #F5F3EE", fontSize: 12 }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Étudiants">
                    {(data?.regionDist ?? []).map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#C9A962" : i === 1 ? "#1B365D" : "#8196BA"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Budget distribution */}
            <ChartCard title="Budget familial" subtitle="Capacité financière déclarée (MAD/mois)">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F3EE" />
                  <XAxis dataKey="bracket" tick={{ fontSize: 11, fill: "#8196BA" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#8196BA" }} />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #F5F3EE", fontSize: 12 }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Étudiants">
                    {budgetData.map((_, i) => (
                      <Cell key={i} fill={["#1B365D", "#3B6FBF", "#C9A962", "#059669"][i % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      {/* ── TAB: SCHOOL DEMAND ── */}
      {tab === "demand" && (
        <div className="space-y-5">
          <ChartCard title="Classement des écoles les plus demandées" subtitle={`${data?.schoolDemand?.length ?? 0} établissements générés en résultats IA`} className="">
            <div className="space-y-3">
              {(data?.schoolDemand ?? []).map((s, i) => {
                const max = data?.schoolDemand?.[0]?.count ?? 1;
                const pct = Math.round((s.count / max) * 100);
                return (
                  <div key={s.schoolSlug} className="flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      i === 0 ? "bg-gold-500 text-navy-900" : i < 3 ? "bg-navy-700 text-white" : "bg-navy-100 text-navy-600"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-navy-800 uppercase tracking-wide">{s.schoolSlug.replace(/-/g, " ")}</span>
                        <div className="flex items-center gap-3 text-xs ml-2 flex-shrink-0">
                          <span className="text-navy-500">{s.count} demandes</span>
                          <span className="text-emerald-600 font-bold">{s.avgProbability}% moy.</span>
                        </div>
                      </div>
                      <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: i === 0 ? "#C9A962" : i < 3 ? "#1B365D" : "#8196BA",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartCard title="Top 10 demandes (graphique)" subtitle="Nombre de profils matchés par école">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={(data?.schoolDemand ?? []).slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F3EE" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#8196BA" }} />
                  <YAxis
                    dataKey="schoolSlug"
                    type="category"
                    tick={{ fontSize: 9, fill: "#8196BA" }}
                    width={90}
                    tickFormatter={(v) => v.split("-").slice(0, 2).join(" ").toUpperCase()}
                  />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #F5F3EE", fontSize: 11 }} formatter={(v) => [v, "Demandes"]} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Demandes">
                    {(data?.schoolDemand ?? []).slice(0, 10).map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#C9A962" : i < 3 ? "#1B365D" : "#8196BA"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Probabilité moyenne de match" subtitle="Score IA moyen par école (%)">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={(data?.schoolDemand ?? []).slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F3EE" />
                  <XAxis
                    dataKey="schoolSlug"
                    tick={{ fontSize: 8, fill: "#8196BA" }}
                    tickFormatter={(v) => v.split("-")[0].toUpperCase()}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#8196BA" }} unit="%" />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #F5F3EE", fontSize: 11 }} formatter={(v) => [`${v}%`, "Probabilité moy."]} />
                  <Bar dataKey="avgProbability" radius={[6, 6, 0, 0]} name="Prob. moy." fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      {/* ── TAB: PROFILES ── */}
      {tab === "profiles" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox label="Total simulations" value={(f?.simulations ?? 0).toLocaleString()} sub="depuis le lancement" />
            <StatBox label="Avec contact" value={(f?.contacts ?? 0).toLocaleString()} sub="email fourni" color="text-blue-700" />
            <StatBox label="Mention TB/B" value={
              ((data?.mentionDist?.find(m => m.mention === "Très Bien")?.count ?? 0) +
               (data?.mentionDist?.find(m => m.mention === "Bien")?.count ?? 0)).toLocaleString()
            } sub="profils excellence" color="text-emerald-700" />
            <StatBox label="Filières actives" value={data?.trackDist?.length ?? 0} sub="filières Bac représentées" color="text-gold-700" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Bac track distribution */}
            <ChartCard title="Répartition par filière Bac" subtitle="Volume et moyenne générale">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={trackData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F3EE" />
                  <XAxis dataKey="bacTrack" tick={{ fontSize: 12, fill: "#8196BA" }} />
                  <YAxis yAxisId="count" tick={{ fontSize: 10, fill: "#8196BA" }} />
                  <YAxis yAxisId="grade" orientation="right" domain={[0, 20]} tick={{ fontSize: 10, fill: "#8196BA" }} unit="/20" />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #F5F3EE", fontSize: 12 }} />
                  <Bar yAxisId="count" dataKey="count" name="Étudiants" radius={[6, 6, 0, 0]}>
                    {trackData.map((t) => <Cell key={t.bacTrack} fill={t.fill} />)}
                  </Bar>
                  <Line yAxisId="grade" type="monotone" dataKey="avgGrade" stroke="#C9A962" strokeWidth={2.5} dot={{ fill: "#C9A962", r: 4 }} name="Moy. générale" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Mention distribution */}
            <ChartCard title="Mentions Bac" subtitle="Qualité académique du bassin d'utilisateurs">
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={220}>
                  <PieChart>
                    <Pie
                      data={mentionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {mentionData.map((m) => <Cell key={m.mention} fill={m.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #F5F3EE", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2.5">
                  {mentionData.map((m) => {
                    const total = mentionData.reduce((s, x) => s + x.count, 0);
                    return (
                      <div key={m.mention} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: m.fill }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-navy-700 truncate">{m.mention}</div>
                          <div className="text-[11px] text-navy-400">{m.count} — {total ? Math.round((m.count / total) * 100) : 0}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ChartCard>

            {/* Budget */}
            <ChartCard title="Capacité financière" subtitle="Budget mensuel familial déclaré">
              <div className="space-y-3 mt-2">
                {budgetData.map((b) => {
                  const total = budgetData.reduce((s, x) => s + x.count, 0);
                  const pct = total ? Math.round((b.count / total) * 100) : 0;
                  return (
                    <div key={b.bracket}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-navy-600 font-medium">{b.bracket} MAD/mois</span>
                        <span className="font-bold text-navy-800">{b.count} ({pct}%)</span>
                      </div>
                      <div className="h-3 bg-navy-50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-navy-700 to-gold-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartCard>

            {/* Lead status */}
            <ChartCard title="Statut des leads" subtitle="Pipeline de suivi commercial">
              <div className="space-y-3 mt-2">
                {(data?.leadStatusDist ?? []).map((s) => {
                  const total = data?.leadStatusDist?.reduce((x, y) => x + y.count, 0) ?? 1;
                  const colorMap: Record<string, string> = { new: "bg-blue-500", contacted: "bg-amber-500", converted: "bg-emerald-500", dormant: "bg-slate-400" };
                  const labelMap: Record<string, string> = { new: "Nouveau", contacted: "Contacté", converted: "Converti", dormant: "Inactif" };
                  return (
                    <div key={s.status}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-navy-600 font-medium">{labelMap[s.status] ?? s.status}</span>
                        <span className="font-bold text-navy-800">{s.count} ({total ? Math.round((s.count / total) * 100) : 0}%)</span>
                      </div>
                      <div className="h-3 bg-navy-50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colorMap[s.status] ?? "bg-navy-400"}`}
                          style={{ width: `${total ? Math.round((s.count / total) * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {/* ── TAB: BUSINESS ── */}
      {tab === "revenue" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatBox label="Revenu total" value={`${totalRevenue.toLocaleString()} MAD`} sub="6 derniers mois" color="text-gold-700" />
            <StatBox label="Opt-ins facturés" value={totalOptIns.toLocaleString()} sub="leads convertis en revenu" color="text-emerald-700" />
            <StatBox label="Prix moyen / opt-in" value={`${avgRevPerOptIn.toLocaleString()} MAD`} sub="across schools" color="text-navy-700" />
            <StatBox label="Taux de conversion" value={`${f?.simToLead ?? 0}%`} sub="simulation → lead" color="text-blue-700" />
          </div>

          <ChartCard title="Revenu mensuel & leads" subtitle="6 derniers mois — cumul des opt-ins facturés">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data?.monthlyRevenue ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F3EE" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8196BA" }} />
                <YAxis yAxisId="rev" tick={{ fontSize: 10, fill: "#8196BA" }} unit=" MAD" width={80} />
                <YAxis yAxisId="leads" orientation="right" tick={{ fontSize: 10, fill: "#8196BA" }} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #F5F3EE", fontSize: 12 }}
                  formatter={(v, n) => [n === "Revenu (MAD)" ? `${Number(v).toLocaleString()} MAD` : v, n]} />
                <Legend />
                <Bar yAxisId="rev" dataKey="revenue" name="Revenu (MAD)" fill="#C9A962" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="leads" dataKey="optIns" name="Opt-ins" fill="#1B365D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartCard title="Entonnoir de conversion" subtitle="Du visiteur au client — taux étape par étape">
              <div className="space-y-4 mt-2">
                {[
                  { from: "Simulations", to: "Leads", rate: f?.simToLead ?? 0, color: "from-navy-700 to-gold-500" },
                  { from: "Leads", to: "Opt-ins", rate: f?.leadToOptIn ?? 0, color: "from-gold-500 to-emerald-500" },
                  { from: "Opt-ins", to: "Convertis", rate: f?.optInToConverted ?? 0, color: "from-emerald-500 to-purple-600" },
                ].map((step) => (
                  <div key={step.from} className="p-4 bg-navy-50/60 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-navy-600 font-semibold">{step.from} → {step.to}</span>
                      <span className="font-heading text-xl font-bold text-navy-800">{step.rate}%</span>
                    </div>
                    <div className="h-2.5 bg-white rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${step.color}`}
                        style={{ width: `${step.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Projection de revenus" subtitle="Basée sur le taux de conversion actuel">
              <div className="space-y-4 mt-2">
                {[
                  { label: "Ce mois (simulation × taux)", value: Math.round((f?.simulations ?? 0) * 0.3 * ((f?.simToLead ?? 0) / 100) * avgRevPerOptIn) },
                  { label: "Potentiel annuel (×12)", value: Math.round((f?.simulations ?? 0) * 0.3 * ((f?.simToLead ?? 0) / 100) * avgRevPerOptIn * 12) },
                  { label: "Si taux opt-in +10pts", value: Math.round((f?.leads ?? 0) * (((f?.leadToOptIn ?? 0) + 10) / 100) * avgRevPerOptIn) },
                ].map((proj) => (
                  <div key={proj.label} className="flex items-center justify-between p-4 bg-navy-50/60 rounded-xl">
                    <span className="text-xs text-navy-600 font-medium max-w-[60%]">{proj.label}</span>
                    <span className="font-heading text-lg font-bold text-gold-700">{proj.value.toLocaleString()} MAD</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-navy-300 mt-4">Projections indicatives basées sur les données actuelles de la plateforme.</p>
            </ChartCard>
          </div>
        </div>
      )}
    </div>
  );
}
