import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiGet, apiPost } from "../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────
interface GeneratedMessage { channel: string; subject: string; body: string; cta: string }
interface LeadRow {
  uuid: string; firstName?: string; lastName?: string; email?: string; phone?: string;
  bacTrack: string; generalGrade: number; mention: string; city: string; region?: string;
  financialBracket: string; consentAt?: string;
  topSchools?: string[];
}
interface LeadsResponse { leads: LeadRow[]; total: number; consentCount: number; avgGrade: number; topTracks: string[]; topCities: string[] }
interface PlatformData { funnel: { consentPrivate: number; consentRate: number }; avgGrade: number; trackDist: Array<{ bacTrack: string; count: number }>; regionDist: Array<{ region: string; count: number }> }

type Tab = "followup" | "pitch" | "leads";
type FollowUpChannel = "email" | "sms" | "whatsapp";
type FollowUpTone = "formal" | "friendly" | "urgent";
type FollowUpObjective = "followup" | "encourage" | "deadline_reminder";
type PitchTone = "formal" | "friendly";
type PitchProposal = "discovery" | "offer" | "follow_up";

const PRIVATE_SCHOOLS = [
  { slug: "um6p", name: "Université Mohammed VI Polytechnique" },
  { slug: "uir", name: "Université Internationale de Rabat" },
  { slug: "hem", name: "HEM Business School" },
  { slug: "al-akhawayn", name: "Université Al Akhawayn" },
  { slug: "esca-casablanca", name: "ESCA École de Management" },
  { slug: "emsi", name: "EMSI" },
  { slug: "mundiapolis", name: "Université Mundiapolis" },
  { slug: "um6ss", name: "UM6SS Sciences de la Santé" },
  { slug: "cesem-casablanca", name: "CESEM" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { void navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs px-3 py-1.5 rounded-lg bg-navy-50 hover:bg-navy-100 text-navy-600 font-medium transition"
    >
      {copied ? "✓ Copié" : "Copier"}
    </button>
  );
}

function MessagePreview({ result, isLoading }: { result: GeneratedMessage | null; isLoading: boolean }) {
  if (isLoading) return (
    <div className="animate-pulse space-y-3 mt-6">
      <div className="h-4 bg-navy-100 rounded w-2/3" />
      <div className="h-4 bg-navy-100 rounded w-full" />
      <div className="h-4 bg-navy-100 rounded w-5/6" />
      <div className="h-4 bg-navy-100 rounded w-3/4" />
    </div>
  );
  if (!result) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 rounded-2xl border border-gold-200 bg-gold-50/30 overflow-hidden"
    >
      {result.subject && (
        <div className="flex items-center justify-between px-5 py-3 bg-navy-800 text-white">
          <div>
            <span className="text-[10px] text-navy-400 uppercase tracking-wide font-bold">Objet</span>
            <p className="text-sm font-semibold mt-0.5">{result.subject}</p>
          </div>
          <CopyButton text={`${result.subject}\n\n${result.body}`} />
        </div>
      )}
      <div className="p-5">
        <p className="text-sm text-navy-700 whitespace-pre-wrap leading-relaxed">{result.body}</p>
        {result.cta && (
          <div className="mt-4 pt-4 border-t border-gold-200 flex items-center justify-between">
            <span className="text-xs text-gold-700 font-bold">CTA : {result.cta}</span>
            {!result.subject && <CopyButton text={result.body} />}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Tab 1: Student Follow-Up ───────────────────────────────────────────────
function FollowUpTab() {
  const [channel, setChannel] = useState<FollowUpChannel>("email");
  const [tone, setTone] = useState<FollowUpTone>("friendly");
  const [objective, setObjective] = useState<FollowUpObjective>("followup");
  const [studentUuid, setStudentUuid] = useState("");
  const [result, setResult] = useState<GeneratedMessage | null>(null);

  const generate = useMutation({
    mutationFn: () => apiPost<GeneratedMessage>("/api/admin/communications/followup", {
      studentUuid: studentUuid.trim() || undefined,
      channel,
      tone,
      objective,
    }),
    onSuccess: setResult,
  });

  const selectStudent = (uuid: string) => { setStudentUuid(uuid); };

  const { data: leadsData } = useQuery<LeadsResponse>({
    queryKey: ["private-leads-mini"],
    queryFn: () => apiGet<LeadsResponse>("/api/admin/leads/private-school?limit=20"),
    staleTime: 60_000,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: controls */}
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-gold-100/60 p-5 shadow-sm">
          <h3 className="font-heading font-bold text-navy-800 mb-4">Paramètres</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-navy-600 block mb-1.5">UUID étudiant (optionnel)</label>
              <input
                type="text"
                value={studentUuid}
                onChange={(e) => setStudentUuid(e.target.value)}
                placeholder="Sélectionner ci-dessous ou coller un UUID"
                className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm text-navy-700 placeholder:text-navy-300 focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy-600 block mb-1.5">Canal</label>
              <div className="flex gap-2">
                {(["email", "sms", "whatsapp"] as FollowUpChannel[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setChannel(c)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${channel === c ? "bg-navy-800 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}
                  >
                    {c === "email" ? "✉️ Email" : c === "sms" ? "📱 SMS" : "💬 WA"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-navy-600 block mb-1.5">Ton</label>
              <div className="flex gap-2">
                {(["formal", "friendly", "urgent"] as FollowUpTone[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${tone === t ? "bg-gold-500 text-navy-900" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}
                  >
                    {t === "formal" ? "Formel" : t === "friendly" ? "Chaleureux" : "Urgent"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-navy-600 block mb-1.5">Objectif</label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value as FollowUpObjective)}
                className="w-full px-3 py-2 rounded-xl border border-navy-200 bg-white text-sm text-navy-700"
              >
                <option value="followup">Rappel simulation & encouragement</option>
                <option value="encourage">Motivation — agir maintenant</option>
                <option value="deadline_reminder">Alerte dates limites inscription</option>
              </select>
            </div>

            <button
              onClick={() => generate.mutate()}
              disabled={generate.isPending}
              className="w-full py-3 bg-gradient-to-r from-navy-800 to-navy-700 hover:from-navy-700 hover:to-navy-600 text-white rounded-xl font-bold text-sm transition disabled:opacity-50"
            >
              {generate.isPending ? "Génération IA..." : "Générer le message"}
            </button>

            {generate.isError && (
              <p className="text-xs text-rose-600 bg-rose-50 rounded-xl px-3 py-2">{generate.error.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Center: lead browser */}
      <div className="bg-white rounded-2xl border border-gold-100/60 p-5 shadow-sm">
        <h3 className="font-heading font-bold text-navy-800 mb-3">Leads consentants ({leadsData?.total ?? "…"})</h3>
        <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
          {(leadsData?.leads ?? []).map((lead) => (
            <button
              key={lead.uuid}
              onClick={() => selectStudent(lead.uuid)}
              className={`w-full text-left p-3 rounded-xl border transition ${studentUuid === lead.uuid ? "border-gold-400 bg-gold-50" : "border-navy-100 hover:border-gold-300 hover:bg-navy-50/50"}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold-300 text-[10px] font-bold">{lead.bacTrack}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-navy-700 truncate">
                    {lead.firstName ? `${lead.firstName} ${lead.lastName ?? ""}` : `Anonyme · ${lead.uuid.slice(0, 8)}`}
                  </div>
                  <div className="text-[10px] text-navy-400 truncate">
                    {lead.generalGrade}/20 · {lead.city}
                    {lead.email && <span className="ml-1 text-emerald-500">✓ email</span>}
                    {lead.phone && <span className="ml-1 text-blue-500">✓ tél</span>}
                  </div>
                </div>
              </div>
            </button>
          ))}
          {!leadsData?.leads?.length && (
            <p className="text-xs text-navy-400 text-center py-8">Aucun lead consenti pour l'instant</p>
          )}
        </div>
      </div>

      {/* Right: result */}
      <div>
        <div className="bg-white rounded-2xl border border-gold-100/60 p-5 shadow-sm">
          <h3 className="font-heading font-bold text-navy-800 mb-1">Message généré</h3>
          <p className="text-xs text-navy-400 mb-1">
            {studentUuid ? `Pour : ${studentUuid.slice(0, 8)}…` : "Sans profil spécifique"}
          </p>
          <MessagePreview result={result} isLoading={generate.isPending} />
          {!result && !generate.isPending && (
            <div className="text-center py-12 text-navy-300">
              <div className="text-3xl mb-2">✉️</div>
              <p className="text-xs">Sélectionnez un lead et cliquez sur Générer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tab 2: B2B School Pitch ────────────────────────────────────────────────
function PitchTab() {
  const [selectedSchool, setSelectedSchool] = useState(PRIVATE_SCHOOLS[0]);
  const [pitchTone, setPitchTone] = useState<PitchTone>("formal");
  const [proposalType, setProposalType] = useState<PitchProposal>("discovery");
  const [result, setResult] = useState<GeneratedMessage | null>(null);

  const { data: platform } = useQuery<PlatformData>({
    queryKey: ["platform-analytics"],
    queryFn: () => apiGet<PlatformData>("/api/admin/analytics/platform"),
    staleTime: 120_000,
  });

  const { data: leadsData } = useQuery<LeadsResponse>({
    queryKey: ["private-leads-stats"],
    queryFn: () => apiGet<LeadsResponse>("/api/admin/leads/private-school?limit=1"),
    staleTime: 120_000,
  });

  const generate = useMutation({
    mutationFn: () => {
      const topTracks = (platform?.trackDist ?? []).slice(0, 3).map((t) => t.bacTrack);
      const topCities = (platform?.regionDist ?? []).slice(0, 3).map((r) => r.region);
      const mentionBreakdown = "TB 20% · B 35% · AB 30% · P 15%";
      return apiPost<GeneratedMessage>("/api/admin/communications/pitch", {
        schoolName: selectedSchool.name,
        schoolSlug: selectedSchool.slug,
        statsContext: {
          totalConsentLeads: leadsData?.total ?? platform?.funnel?.consentPrivate ?? 0,
          topTracks,
          avgGrade: platform?.avgGrade ?? leadsData?.avgGrade ?? 14,
          topCities,
          mentionBreakdown,
        },
        tone: pitchTone,
        proposalType,
      });
    },
    onSuccess: setResult,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: controls */}
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-gold-100/60 p-5 shadow-sm">
          <h3 className="font-heading font-bold text-navy-800 mb-4">École cible</h3>

          <div className="space-y-3 mb-5">
            {PRIVATE_SCHOOLS.map((school) => (
              <button
                key={school.slug}
                onClick={() => setSelectedSchool(school)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition text-sm font-medium ${selectedSchool.slug === school.slug ? "border-gold-400 bg-gold-50 text-navy-800" : "border-navy-100 hover:border-navy-200 text-navy-600"}`}
              >
                {school.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gold-100/60 p-5 shadow-sm">
          <h3 className="font-heading font-bold text-navy-800 mb-4">Type de pitch</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-navy-600 block mb-1.5">Type de proposition</label>
              <select
                value={proposalType}
                onChange={(e) => setProposalType(e.target.value as PitchProposal)}
                className="w-full px-3 py-2 rounded-xl border border-navy-200 bg-white text-sm text-navy-700"
              >
                <option value="discovery">Premier contact — RDV découverte</option>
                <option value="offer">Offre commerciale leads qualifiés</option>
                <option value="follow_up">Relance après premier contact</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-navy-600 block mb-1.5">Ton</label>
              <div className="flex gap-2">
                {(["formal", "friendly"] as PitchTone[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPitchTone(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${pitchTone === t ? "bg-gold-500 text-navy-900" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}
                  >
                    {t === "formal" ? "Formel" : "Chaleureux"}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => generate.mutate()}
              disabled={generate.isPending}
              className="w-full py-3 bg-gradient-to-r from-violet-700 to-violet-600 hover:from-violet-600 hover:to-violet-500 text-white rounded-xl font-bold text-sm transition disabled:opacity-50"
            >
              {generate.isPending ? "Génération IA..." : "Générer l'email B2B"}
            </button>

            {generate.isError && (
              <p className="text-xs text-rose-600 bg-rose-50 rounded-xl px-3 py-2">{generate.error.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Center: stats context */}
      <div className="bg-white rounded-2xl border border-gold-100/60 p-5 shadow-sm">
        <h3 className="font-heading font-bold text-navy-800 mb-4">Données leads (auto-injectées)</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-navy-500">Leads qualifiés</span>
            <span className="font-bold text-navy-800">{(leadsData?.total ?? platform?.funnel?.consentPrivate ?? 0).toLocaleString("fr-MA")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-navy-500">Note bac moyenne</span>
            <span className="font-bold text-navy-800">{platform?.avgGrade ?? "—"}/20</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-navy-500">Taux consentement</span>
            <span className="font-bold text-violet-600">{platform?.funnel?.consentRate ?? "—"}%</span>
          </div>
          <div>
            <span className="text-navy-500 text-sm block mb-2">Top filières</span>
            <div className="flex flex-wrap gap-1.5">
              {(platform?.trackDist ?? []).slice(0, 4).map((t) => (
                <span key={t.bacTrack} className="text-[10px] font-bold px-2 py-1 bg-navy-50 text-navy-700 rounded-lg">{t.bacTrack} ({t.count})</span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-navy-500 text-sm block mb-2">Top régions</span>
            <div className="flex flex-wrap gap-1.5">
              {(platform?.regionDist ?? []).slice(0, 4).map((r) => (
                <span key={r.region} className="text-[10px] font-bold px-2 py-1 bg-gold-50 text-gold-800 rounded-lg truncate max-w-[140px]">{r.region}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 p-3 bg-violet-50 border border-violet-200 rounded-xl">
          <p className="text-xs text-violet-700 font-medium">École sélectionnée :</p>
          <p className="text-sm font-bold text-violet-900 mt-0.5">{selectedSchool.name}</p>
        </div>
      </div>

      {/* Right: result */}
      <div className="bg-white rounded-2xl border border-gold-100/60 p-5 shadow-sm">
        <h3 className="font-heading font-bold text-navy-800 mb-1">Email B2B généré</h3>
        <p className="text-xs text-navy-400 mb-1">Pour : {selectedSchool.name}</p>
        <MessagePreview result={result} isLoading={generate.isPending} />
        {!result && !generate.isPending && (
          <div className="text-center py-12 text-navy-300">
            <div className="text-3xl mb-2">🤝</div>
            <p className="text-xs">Sélectionnez une école et générez le pitch B2B</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab 3: Leads Browser ───────────────────────────────────────────────────
function LeadsTab() {
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("");

  const { data, isLoading } = useQuery<LeadsResponse>({
    queryKey: ["private-leads-full"],
    queryFn: () => apiGet<LeadsResponse>("/api/admin/leads/private-school?limit=200"),
    staleTime: 60_000,
  });

  const leads = (data?.leads ?? []).filter((l) => {
    const matchesSearch = !search || [l.firstName, l.lastName, l.email, l.city].some((v) => v?.toLowerCase().includes(search.toLowerCase()));
    const matchesTrack = !trackFilter || l.bacTrack === trackFilter;
    return matchesSearch && matchesTrack;
  });

  const allTracks = [...new Set((data?.leads ?? []).map((l) => l.bacTrack))].sort();

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Leads consentants", value: data?.total ?? 0, color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
          { label: "Note bac moyenne", value: data?.avgGrade ? `${data.avgGrade}/20` : "—", color: "text-navy-800", bg: "bg-white border-gold-100" },
          { label: "Filières principales", value: (data?.topTracks ?? []).slice(0, 3).join(" · ") || "—", color: "text-navy-600", bg: "bg-white border-gold-100" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border rounded-2xl p-4 shadow-sm`}>
            <div className={`font-heading text-xl font-bold ${s.color}`}>{typeof s.value === "number" ? s.value.toLocaleString("fr-MA") : s.value}</div>
            <div className="text-xs text-navy-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher nom, email, ville…"
          className="flex-1 px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-700 focus:outline-none focus:border-gold-400"
        />
        <select
          value={trackFilter}
          onChange={(e) => setTrackFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-navy-200 bg-white text-sm text-navy-700"
        >
          <option value="">Toutes filières</option>
          {allTracks.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gold-100/60 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-navy-400 text-sm animate-pulse">Chargement des leads…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-50 text-left">
                  <th className="px-4 py-3 text-xs font-bold text-navy-500 uppercase tracking-wide">Identité</th>
                  <th className="px-4 py-3 text-xs font-bold text-navy-500 uppercase tracking-wide">Contact</th>
                  <th className="px-4 py-3 text-xs font-bold text-navy-500 uppercase tracking-wide">Filière / Note</th>
                  <th className="px-4 py-3 text-xs font-bold text-navy-500 uppercase tracking-wide">Ville</th>
                  <th className="px-4 py-3 text-xs font-bold text-navy-500 uppercase tracking-wide">Budget</th>
                  <th className="px-4 py-3 text-xs font-bold text-navy-500 uppercase tracking-wide">Consent.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {leads.map((lead) => (
                  <tr key={lead.uuid} className="hover:bg-navy-50/30 transition">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-navy-800 text-xs">
                        {lead.firstName ? `${lead.firstName} ${lead.lastName ?? ""}`.trim() : <span className="text-navy-400 italic">Anonyme</span>}
                      </div>
                      <div className="text-[10px] text-navy-400 font-mono">{lead.uuid.slice(0, 12)}…</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-navy-700">{lead.email ?? <span className="text-navy-300">—</span>}</div>
                      <div className="text-xs text-navy-500">{lead.phone ?? <span className="text-navy-300">—</span>}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-navy-100 text-navy-700 mr-1">{lead.bacTrack}</span>
                      <span className="text-xs font-bold text-navy-800">{lead.generalGrade}/20</span>
                      <div className="text-[10px] text-navy-400 mt-0.5">{lead.mention}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-navy-600">{lead.city}</td>
                    <td className="px-4 py-3 text-xs text-navy-500">{lead.financialBracket}</td>
                    <td className="px-4 py-3 text-[10px] text-emerald-600 font-bold">
                      {lead.consentAt ? new Date(lead.consentAt).toLocaleDateString("fr-MA") : "✓"}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-navy-400 text-sm">Aucun lead trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Communications() {
  const [tab, setTab] = useState<Tab>("followup");

  const tabs: { id: Tab; label: string; icon: string; desc: string }[] = [
    { id: "followup", label: "Suivi Étudiant", icon: "✉️", desc: "Email · SMS · WhatsApp personnalisés par IA" },
    { id: "pitch", label: "Pitch École Privée", icon: "🤝", desc: "Email B2B vers partenaires acquisition" },
    { id: "leads", label: "Leads Partenaires", icon: "💼", desc: "Consulter les leads consentants" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* ── Header ── */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-800">Communications IA</h1>
        <p className="text-navy-400 text-sm mt-1">Génération automatique de messages par Gemini 2.5 · Contexte marocain · Conformité CNDP</p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition text-left ${
              tab === t.id
                ? "border-gold-400 bg-gold-50 text-navy-800 shadow-sm"
                : "border-navy-100 bg-white text-navy-500 hover:border-navy-200"
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            <div>
              <div className="text-sm font-bold">{t.label}</div>
              <div className="text-[10px] opacity-70 hidden sm:block">{t.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      {tab === "followup" && <FollowUpTab />}
      {tab === "pitch" && <PitchTab />}
      {tab === "leads" && <LeadsTab />}
    </div>
  );
}
