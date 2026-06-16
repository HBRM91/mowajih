import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiGet, apiPost, API_URL } from "../lib/api";
import { useAuthStore } from "../stores/authStore";

// API_URL used for DELETE call below — kept intentionally

interface MonitoringStatus {
  complete: boolean;
  year?: number;
  markedAt?: string;
}

interface PlatformData {
  funnel: { simulations: number; consentPrivate: number; consentRate: number };
  todaySimulations: number;
  avgGrade: number;
}

type DataMode = "anonymous" | "full";

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${ok ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
      {label}
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gold-100/60 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-navy-50 flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <h2 className="font-heading font-bold text-navy-800">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function Settings() {
  const qc = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const [geminiKeyInput, setGeminiKeyInput] = useState("");
  const [keyTestResult, setKeyTestResult] = useState<"idle" | "testing" | "ok" | "fail">("idle");
  const [confirmFull, setConfirmFull] = useState(false);

  // Data collection mode
  const { data: modeData, isLoading: modeLoading } = useQuery<{ mode: DataMode }>({
    queryKey: ["platform-mode-admin"],
    queryFn: () => apiGet<{ mode: DataMode }>("/api/public/platform-mode"),
    staleTime: 30_000,
  });

  const setMode = useMutation({
    mutationFn: (mode: DataMode) => apiPost("/api/admin/platform-mode", { mode }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform-mode-admin"] });
      setConfirmFull(false);
    },
  });

  const currentMode: DataMode = modeData?.mode ?? "anonymous";

  // Platform stats
  const { data: platform } = useQuery<PlatformData>({
    queryKey: ["platform-analytics"],
    queryFn: () => apiGet("/api/admin/analytics/platform"),
    staleTime: 60_000,
  });

  // Monitoring status
  const { data: monitoringRaw, isLoading: monitoringLoading } = useQuery<MonitoringStatus>({
    queryKey: ["monitoring-status"],
    queryFn: () => apiGet<MonitoringStatus>("/api/admin/seuils/monitoring/complete"),
    staleTime: 30_000,
  });

  const markComplete = useMutation({
    mutationFn: () => apiPost("/api/admin/seuils/monitoring/complete", {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["monitoring-status"] }),
  });

  const resetMonitoring = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/seuils/monitoring/complete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["monitoring-status"] }),
  });

  const testGeminiKey = async () => {
    if (!geminiKeyInput.trim()) return;
    setKeyTestResult("testing");
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKeyInput.trim()}`,
        { method: "GET" }
      );
      setKeyTestResult(res.ok ? "ok" : "fail");
    } catch {
      setKeyTestResult("fail");
    }
  };

  const isMonitoringComplete = monitoringRaw?.complete ?? false;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-800">Paramètres plateforme</h1>
        <p className="text-navy-400 text-sm mt-1">Configuration de JAD2 TAWJIH · Accès administrateur uniquement</p>
      </div>

      {/* Data Collection Mode — most critical operational toggle */}
      <SectionCard title="Mode de collecte des données" icon="🛡️">
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            {modeLoading ? (
              <div className="h-7 w-40 bg-navy-100 rounded-full animate-pulse" />
            ) : currentMode === "anonymous" ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Mode anonyme — actif
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-red-50 border border-red-200 text-red-700">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Collecte complète — active
              </div>
            )}
          </div>

          <div className={`rounded-xl p-4 text-sm leading-relaxed ${currentMode === "anonymous" ? "bg-emerald-50 border border-emerald-100 text-emerald-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            {currentMode === "anonymous" ? (
              <>
                <p className="font-bold mb-1">✓ Mode CNDP-safe — aucune donnée personnelle collectée</p>
                <p className="text-xs">Seules des statistiques anonymisées sont sauvegardées : filière, notes, région, budget. Aucun nom, email, téléphone ou opt-in école privée n'est demandé ou stocké. Le formulaire affiche automatiquement un message "Mode anonyme" aux étudiants.</p>
              </>
            ) : (
              <>
                <p className="font-bold mb-1">⚠️ ATTENTION — Collecte de données personnelles active</p>
                <p className="text-xs">Les étudiants peuvent renseigner nom, email, téléphone et accepter le partage avec des écoles privées. Ce mode ne doit être activé qu'après obtention de l'approbation CNDP (déclaration A-GC déposée et validée).</p>
              </>
            )}
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            {currentMode === "anonymous" ? (
              <>
                {!confirmFull ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setConfirmFull(true)}
                    disabled={setMode.isPending || modeLoading}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold transition disabled:opacity-40"
                  >
                    Activer la collecte complète (CNDP requis)
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-xs text-red-700 font-semibold">Tu confirmes avoir l'approbation CNDP ?</p>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setMode.mutate("full")}
                      disabled={setMode.isPending}
                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition disabled:opacity-40"
                    >
                      {setMode.isPending ? "En cours…" : "Oui, confirmer"}
                    </motion.button>
                    <button onClick={() => setConfirmFull(false)} className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition">
                      Annuler
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode.mutate("anonymous")}
                disabled={setMode.isPending || modeLoading}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition disabled:opacity-40"
              >
                {setMode.isPending ? "En cours…" : "↩ Repasser en mode anonyme"}
              </motion.button>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Platform Identity */}
      <SectionCard title="Identité de la plateforme" icon="🎓">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Plateforme", value: "JAD2 TAWJIH" },
            { label: "Fondateur & Admin", value: "Hamza El Bouhali" },
            { label: "Email", value: "hamzaelbouhali@gmail.com" },
            { label: "Environnement", value: "Cloudflare Workers + Pages" },
            { label: "API Worker", value: "tawjih-api.hamzaelbouhali.workers.dev" },
            { label: "Modèle IA", value: "Gemini 2.5 Flash" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-navy-50/50 px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-navy-400 mb-0.5">{item.label}</div>
              <div className="text-sm font-semibold text-navy-800">{item.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Platform Stats */}
      <SectionCard title="Statistiques plateforme" icon="📊">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Simulations totales", value: platform?.funnel?.simulations?.toLocaleString("fr-MA") ?? "—" },
            { label: "Leads privés CNDP", value: platform?.funnel?.consentPrivate?.toLocaleString("fr-MA") ?? "—" },
            { label: "Taux consentement", value: `${platform?.funnel?.consentRate ?? "—"}%` },
            { label: "Note bac moy.", value: `${platform?.avgGrade ?? "—"}/20` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-gold-100 p-4 text-center">
              <div className="font-heading text-2xl font-bold text-navy-800">{s.value}</div>
              <div className="text-[11px] text-navy-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Monitoring de la saison */}
      <SectionCard title="Monitoring Saison Tawjihi" icon="📅">
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <StatusPill
              ok={!isMonitoringComplete}
              label={isMonitoringComplete ? "Monitoring terminé" : "Monitoring actif (cron 3×/jour)"}
            />
            {monitoringRaw?.year && (
              <span className="text-xs text-navy-400">Saison {monitoringRaw.year} · Marqué le {monitoringRaw.markedAt ? new Date(monitoringRaw.markedAt).toLocaleDateString("fr-MA") : "—"}</span>
            )}
          </div>

          <div className="bg-navy-50/60 rounded-xl p-4 text-xs text-navy-500 leading-relaxed">
            <p className="font-bold text-navy-700 mb-1">Comment ça marche</p>
            <p>Cron actif du 17 juin au 31 août : 3×/jour (06h, 14h, 22h). Gemini 2.5 Flash scrape les seuils Tawjihi et suggère des mises à jour dans la page Seuils. Quand tous les établissements ont publié leurs seuils définitifs, marquez la saison comme terminée pour passer en mode maintenance (1×/jour).</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => markComplete.mutate()}
              disabled={markComplete.isPending || isMonitoringComplete || monitoringLoading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition disabled:opacity-40"
            >
              {markComplete.isPending ? "En cours…" : "✓ Marquer saison terminée"}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => resetMonitoring.mutate()}
              disabled={resetMonitoring.isPending || !isMonitoringComplete || monitoringLoading}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold transition disabled:opacity-40"
            >
              {resetMonitoring.isPending ? "En cours…" : "↺ Réactiver le monitoring"}
            </motion.button>
          </div>
        </div>
      </SectionCard>

      {/* Gemini API */}
      <SectionCard title="Clé API Gemini" icon="🤖">
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            <p className="font-bold mb-1">Clé API configurée via Cloudflare Workers Secret</p>
            <p>La clé est stockée en secret Worker (<code className="bg-amber-100 px-1 rounded">GEMINI_API_KEY</code>). Ne la collez pas ici. Pour la mettre à jour, utilisez <code className="bg-amber-100 px-1 rounded">wrangler secret put GEMINI_API_KEY</code> dans le terminal.</p>
          </div>

          <div>
            <label className="text-xs font-bold text-navy-600 block mb-1.5">Tester une clé (ne sera pas sauvegardée)</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={geminiKeyInput}
                onChange={(e) => { setGeminiKeyInput(e.target.value); setKeyTestResult("idle"); }}
                placeholder="AIza…"
                className="flex-1 px-4 py-2 rounded-xl border border-navy-200 text-sm text-navy-700 focus:outline-none focus:border-gold-400"
              />
              <button
                onClick={() => void testGeminiKey()}
                disabled={keyTestResult === "testing" || !geminiKeyInput.trim()}
                className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white text-sm font-bold transition disabled:opacity-40"
              >
                {keyTestResult === "testing" ? "Test…" : "Tester"}
              </button>
            </div>
            {keyTestResult === "ok" && <p className="text-xs text-emerald-600 font-bold mt-2">✓ Clé valide — l'API Gemini répond correctement</p>}
            {keyTestResult === "fail" && <p className="text-xs text-red-600 font-bold mt-2">✗ Clé invalide ou quota dépassé</p>}
          </div>
        </div>
      </SectionCard>

      {/* CNDP Compliance — 2 phases */}
      <SectionCard title="Conformité CNDP — 2 phases" icon="🔐">
        <div className="space-y-6">

          {/* Phase 1 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-white bg-navy-700 rounded-full px-3 py-1 uppercase tracking-wider">Phase 1</span>
              <span className="text-sm font-bold text-navy-700">DS — Déclaration Simplifiée</span>
              <span className="ml-auto text-[11px] text-navy-400">→ Déposer avant le 17 juin 2026</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 text-xs text-amber-800">
              <p className="font-bold mb-0.5">Mode anonyme actuel — couvert par la DS</p>
              <p>Couvre : filière, notes, région, budget (aucune donnée identifiante). Récépissé obtenu en 24–72h. Portail : <a href="https://portail.cndp.ma" target="_blank" rel="noopener noreferrer" className="underline">portail.cndp.ma</a> · Guide complet : <code className="bg-amber-100 px-1 rounded">docs/cndp-jad2-tawjih.md</code></p>
            </div>
            <div className="space-y-2">
              {[
                { label: "Formulaire DS déposé (données anonymes)", ok: false, detail: "Contenu exact à copier dans docs/cndp-jad2-tawjih.md § Phase 1" },
                { label: "Formulaire T-HB Phase 1 déposé (Cloudflare)", ok: false, detail: "Déposer simultanément avec la DS" },
                { label: "DPA Cloudflare signé", ok: false, detail: "Cloudflare Dashboard → Account → Legal → DPA" },
                { label: "N° récépissé DS noté dans docs/cndp-jad2-tawjih.md", ok: false, detail: "Immédiat à réception du récépissé CNDP" },
                { label: "Privacy policy mise à jour avec le n° DS", ok: false, detail: "Déployer avant le 17 juin" },
                { label: "Suppression données sur demande", ok: true, detail: "DELETE /api/admin/profiles/:uuid — opérationnel" },
                { label: "Purge auto 24 mois (retentionExpiry)", ok: true, detail: "Champ retentionExpiry en D1 — Cron actif" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-navy-50/50">
                  <span className={`text-sm flex-shrink-0 mt-0.5 font-bold ${item.ok ? "text-emerald-600" : "text-amber-500"}`}>
                    {item.ok ? "✓" : "○"}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-navy-700">{item.label}</div>
                    <div className="text-xs text-navy-400 mt-0.5">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-navy-100" />

          {/* Phase 2 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-white bg-violet-700 rounded-full px-3 py-1 uppercase tracking-wider">Phase 2</span>
              <span className="text-sm font-bold text-navy-700">A-GC + T-HB — Autorisation données personnelles</span>
            </div>
            <div className={`rounded-xl p-3 mb-3 text-xs ${currentMode === "full" ? "bg-red-50 border border-red-200 text-red-800" : "bg-navy-50 border border-navy-100 text-navy-600"}`}>
              <p className="font-bold mb-0.5">
                {currentMode === "full" ? "⚠ Mode complet actif — l'autorisation A-GC doit être obtenue" : "Mode anonyme — Phase 2 non requise actuellement"}
              </p>
              <p>Couvre : prénom, nom, email, téléphone, opt-in écoles. Délai CNDP : 30–60 jours. Ne jamais activer le toggle "Collecte complète" sans le n° d'autorisation A-GC.</p>
            </div>
            <div className="space-y-2">
              {[
                { label: "Formulaire A-GC déposé (données personnelles)", ok: false, detail: "Référencer le n° DS Phase 1 — contenu dans docs/cndp-jad2-tawjih.md § Phase 2" },
                { label: "Formulaire T-HB Phase 2 déposé (données personnelles)", ok: false, detail: "Déposer après l'A-GC, référencer les 2 n°" },
                { label: "DPA Google Gemini signé", ok: false, detail: "Google Cloud Console → IAM & Admin → Data Processing" },
                { label: "N° autorisation A-GC reçu et noté", ok: false, detail: "Obligatoire avant d'activer le mode Collecte complète" },
                { label: "Conventions signées avec établissements partenaires", ok: false, detail: "1 convention par établissement — modèle dans docs/cndp-jad2-tawjih.md" },
                { label: "Consentement opt-in B2B (double checkbox)", ok: true, detail: "StepConsent.tsx — non pré-coché, granulaire par établissement" },
                { label: "Enregistrement horodaté des consentements", ok: true, detail: "Champ consentPrivateAt en D1" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-navy-50/50">
                  <span className={`text-sm flex-shrink-0 mt-0.5 font-bold ${item.ok ? "text-emerald-600" : "text-navy-300"}`}>
                    {item.ok ? "✓" : "○"}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-navy-700">{item.label}</div>
                    <div className="text-xs text-navy-400 mt-0.5">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gold-50 border border-gold-200 rounded-xl text-xs text-gold-800">
            <span className="text-base flex-shrink-0">📋</span>
            <p>Guide complet avec contenu exact des formulaires : <strong>docs/cndp-jad2-tawjih.md</strong> · Portail dépôt : <a href="https://portail.cndp.ma" target="_blank" rel="noopener noreferrer" className="underline font-bold">portail.cndp.ma</a> · Contact CNDP : <a href="mailto:contact@cndp.ma" className="underline">contact@cndp.ma</a></p>
          </div>
        </div>
      </SectionCard>

      {/* Data Management */}
      <SectionCard title="Gestion des données" icon="🗄️">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="/leads-export"
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-violet-200 hover:bg-violet-50 transition group"
          >
            <span className="text-xl">💼</span>
            <div>
              <div className="text-sm font-bold text-navy-800 group-hover:text-violet-700">Export Leads Privés</div>
              <div className="text-xs text-navy-400">CSV · CNDP conforme</div>
            </div>
          </a>
          <a
            href="/seuils"
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-gold-200 hover:bg-gold-50 transition group"
          >
            <span className="text-xl">🎚️</span>
            <div>
              <div className="text-sm font-bold text-navy-800 group-hover:text-gold-700">Seuils en attente</div>
              <div className="text-xs text-navy-400">Suggestions IA à valider</div>
            </div>
          </a>
          <a
            href="/analytics"
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition group"
          >
            <span className="text-xl">📈</span>
            <div>
              <div className="text-sm font-bold text-navy-800 group-hover:text-blue-700">Analytiques complètes</div>
              <div className="text-xs text-navy-400">4 onglets · Tendances</div>
            </div>
          </a>
        </div>
      </SectionCard>
    </div>
  );
}
