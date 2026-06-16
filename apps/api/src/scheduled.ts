import type { Env } from "./types/env";

// Baseline school data for AI analysis — kept in sync with apps/web/src/data/schools.ts
const SCHOOLS_BASELINE = [
  { slug: "emi", shortName: "EMI", tracks: ["SM","PC","STI"], currentMinGrade: 16, currentCostMin: 0, currentCostMax: 3000, admissionType: "cnc" },
  { slug: "ehtp", shortName: "EHTP", tracks: ["SM","PC"], currentMinGrade: 16, currentCostMin: 5000, currentCostMax: 15000, admissionType: "cnc" },
  { slug: "ensias", shortName: "ENSIAS", tracks: ["SM","PC","STI"], currentMinGrade: 16, currentCostMin: 0, currentCostMax: 3000, admissionType: "cnc" },
  { slug: "inpt", shortName: "INPT", tracks: ["SM","PC","STI"], currentMinGrade: 16, currentCostMin: 0, currentCostMax: 5000, admissionType: "cnc" },
  { slug: "enim", shortName: "ENIM", tracks: ["SM","PC"], currentMinGrade: 15, currentCostMin: 0, currentCostMax: 3000, admissionType: "cnc" },
  { slug: "insea", shortName: "INSEA", tracks: ["SM","PC","SE"], currentMinGrade: 15, currentCostMin: 0, currentCostMax: 3000, admissionType: "cnc" },
  { slug: "ensa-casablanca", shortName: "ENSA Casa", tracks: ["SM","PC","STI"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 5000, admissionType: "concours" },
  { slug: "ensam-casablanca", shortName: "ENSAM Casa", tracks: ["SM","PC","STI"], currentMinGrade: 12.25, currentCostMin: 45000, currentCostMax: 55000, admissionType: "concours" },
  { slug: "iscae", shortName: "ISCAE", tracks: ["SE","SM","PC"], currentMinGrade: 17.24, currentCostMin: 0, currentCostMax: 5000, admissionType: "concours" },
  { slug: "encg-casablanca", shortName: "ENCG Casa", tracks: ["SE","SM","PC","SVT"], currentMinGrade: 12, currentCostMin: 5000, currentCostMax: 12000, admissionType: "tafem" },
  { slug: "iav-hassan-ii", shortName: "IAV Hassan II", tracks: ["SVT","PC","SM"], currentMinGrade: 15, currentCostMin: 0, currentCostMax: 5000, admissionType: "concours" },
  { slug: "fm-rabat", shortName: "FMP Rabat", tracks: ["SVT","PC"], currentMinGrade: 12, currentCostMin: 0, currentCostMax: 2000, admissionType: "concours" },
  { slug: "um6p", shortName: "UM6P", tracks: ["SM","PC","SVT","SE"], currentMinGrade: 14, currentCostMin: 45000, currentCostMax: 100000, admissionType: "dossier" },
  { slug: "uir", shortName: "UIR", tracks: ["SM","PC","SVT","SE","STI"], currentMinGrade: 12, currentCostMin: 30000, currentCostMax: 70000, admissionType: "dossier" },
  { slug: "hem", shortName: "HEM", tracks: ["SE","SM","PC"], currentMinGrade: 13, currentCostMin: 35000, currentCostMax: 65000, admissionType: "dossier" },
  { slug: "al-akhawayn", shortName: "AUI", tracks: ["SM","PC","SE","SVT","SH","L"], currentMinGrade: 14, currentCostMin: 80000, currentCostMax: 120000, admissionType: "dossier" },
];

// Default deadlines — overridden by KV if admin has set them
const DEFAULT_DEADLINES = [
  { id: "bac", label: "Résultats Bac", sublabel: "Résultats officiels Tawjihi", date: "2026-06-17T08:00:00", color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", icon: "🎓", link: "https://bac.men.gov.ma", linkLabel: "men.gov.ma" },
  { id: "cursussup", label: "cursussup.gov.ma", sublabel: "Phase 1 — ENSA, ENCG, ENSAM...", date: "2026-07-15T23:59:00", color: "from-blue-500 to-blue-600", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", icon: "🖥️", link: "https://cursussup.gov.ma", linkLabel: "cursussup.gov.ma" },
  { id: "tafem", label: "TAFEM — ENCG", sublabel: "Concours d'accès aux 12 campus ENCG", date: "2026-08-22T09:00:00", color: "from-amber-500 to-amber-600", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", icon: "📝", link: "https://tafem.ma", linkLabel: "tafem.ma" },
  { id: "fmp", label: "FMP Médecine", sublabel: "Concours national d'entrée en médecine", date: "2026-08-08T08:00:00", color: "from-rose-500 to-rose-600", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-800", icon: "🩺", link: null, linkLabel: null },
  { id: "privees", label: "Écoles privées", sublabel: "Dossiers UM6P, UIR, HEM, AUI", date: "2026-07-31T23:59:00", color: "from-violet-500 to-violet-600", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-800", icon: "🏛️", link: null, linkLabel: null },
];

interface GeminiResp {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

interface ScrapedPage {
  url: string;
  content: string;
}

// Attempt to fetch publicly accessible static pages
async function tryFetchPage(url: string, timeoutMs = 5000): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "JAD2-TAWJIH/1.0 orientation-bot" },
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Strip scripts/style, keep only text content
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 3000); // Max 3000 chars per page
    return text.length > 100 ? text : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Auto-suggest seuil updates using AI
async function runSugilsAutoSuggest(env: Env): Promise<void> {
  const schoolList = SCHOOLS_BASELINE.map((s) =>
    `- ${s.shortName} (${s.slug}): filières [${s.tracks.join(", ")}], seuil actuel ${s.currentMinGrade}/20, type ${s.admissionType}, frais ${s.currentCostMin}–${s.currentCostMax} MAD/an`
  ).join("\n");

  // Try to fetch some static pages for grounding
  const pages: ScrapedPage[] = [];
  const targets = [
    { url: "https://www.encg.ac.ma", label: "ENCG National" },
    { url: "https://www.emi.ac.ma", label: "EMI" },
    { url: "https://tafem.ma", label: "TAFEM" },
  ];

  await Promise.allSettled(
    targets.map(async ({ url, label }) => {
      const content = await tryFetchPage(url);
      if (content) pages.push({ url: label, content });
    })
  );

  const scrapedSection = pages.length > 0
    ? `\n\nCONTENU PAGES OFFICIELLES RÉCUPÉRÉ:\n${pages.map((p) => `[${p.url}]: ${p.content.slice(0, 800)}`).join("\n\n")}`
    : "\n\nNote: pages officielles non accessibles — utilise tes données d'entraînement pour les seuils 2025.";

  const prompt = `Tu es expert en admissions aux grandes écoles marocaines. Session académique 2025-2026. Date: ${new Date().toLocaleDateString("fr-MA")}.

Analyse ces établissements et suggère des mises à jour des seuils d'admission et frais de scolarité basées sur l'année académique 2025-2026:
${schoolList}
${scrapedSection}

RÈGLES:
- Seuils de pré-sélection cursussup: utilise formule 75%×note nationale + 25%×note régionale
- EMI/EHTP/ENSIAS/INPT/ENIM: seuil = note Bac minimum pour être admis en CPGE compétitive (MP/PSI/TSI)
- ENCG: seuil TAFEM pré-inscription SE/SM ≥12.00, PC/SVT ≥14.00
- Si incertain pour un établissement, confidence = "low" et garde les valeurs actuelles
- Ne suggère de changement que si tu as des données fiables (confidence high/medium)

Réponds UNIQUEMENT en JSON:
{"suggestions":[{"slug":"string","suggestedMinGrade":number,"suggestedCostMin":number,"suggestedCostMax":number,"confidence":"high"|"medium"|"low","source":"string","notes":"string"}]}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048, responseMimeType: "application/json" },
        }),
      }
    );

    const data = (await res.json()) as GeminiResp;
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(raw) as { suggestions?: unknown[] };

    // Filter: only keep high/medium confidence suggestions that actually differ
    const current = SCHOOLS_BASELINE.reduce((acc, s) => {
      acc[s.slug] = s;
      return acc;
    }, {} as Record<string, typeof SCHOOLS_BASELINE[0]>);

    type Suggestion = { slug: string; suggestedMinGrade: number; suggestedCostMin: number; suggestedCostMax: number; confidence: string; source: string; notes: string };
    const filtered = (parsed.suggestions ?? []).filter((s) => {
      const sugg = s as Suggestion;
      if (!sugg.confidence || sugg.confidence === "low") return false;
      const baseline = current[sugg.slug];
      if (!baseline) return false;
      const gradeChanged = Math.abs((sugg.suggestedMinGrade ?? baseline.currentMinGrade) - baseline.currentMinGrade) >= 0.5;
      const costChanged = Math.abs((sugg.suggestedCostMin ?? baseline.currentCostMin) - baseline.currentCostMin) >= 2000;
      return gradeChanged || costChanged;
    });

    if (filtered.length > 0) {
      const pendingKey = "school_seuils_pending";
      await env.CACHE.put(pendingKey, JSON.stringify({
        suggestions: filtered,
        generatedAt: new Date().toISOString(),
        pagesScraped: pages.length,
        count: filtered.length,
      }), { expirationTtl: 60 * 60 * 24 * 30 }); // Keep for 30 days
    }
  } catch (err) {
    console.error("Auto-suggest seuils failed:", err);
  }
}

// Auto-update deadlines based on AI knowledge of Moroccan academic calendar
async function runDeadlinesAutoUpdate(env: Env): Promise<void> {
  // Only refresh if no admin override exists or last update was >60 days ago
  const existing = await env.CACHE.get("calendar_deadlines");
  if (existing) {
    const parsed = JSON.parse(existing) as { updatedAt?: string; source?: string };
    if (parsed.source === "admin") return; // Admin manually set — never overwrite
    const lastUpdate = parsed.updatedAt ? new Date(parsed.updatedAt) : null;
    if (lastUpdate && Date.now() - lastUpdate.getTime() < 60 * 24 * 60 * 60 * 1000) return;
  }

  const year = new Date().getFullYear();
  const prompt = `Tu es expert en calendrier académique marocain. Génère les dates clés pour l'année académique ${year}–${year + 1} du système Tawjihi marocain.

Dates typiques au Maroc:
- Résultats Bac: mi-juin (généralement 15-20 juin)
- cursussup.gov.ma Phase 1: 20 juin - 15 juillet
- TAFEM ENCG concours: fin août (20-25 août)
- FMP médecine concours: début août (5-10 août)
- Dossiers écoles privées: fin juillet (31 juillet)

Génère les dates pour ${year} en JSON:
{"deadlines":[{"id":"string","date":"YYYY-MM-DDTHH:mm:ss","label":"string","sublabel":"string"}]}

IDs à utiliser: bac, cursussup, tafem, fmp, privees`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 512, responseMimeType: "application/json" },
        }),
      }
    );

    const data = (await res.json()) as GeminiResp;
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    type DLEntry = { id: string; date: string; label: string; sublabel: string };
    const parsed = JSON.parse(raw) as { deadlines?: DLEntry[] };
    const updates = parsed.deadlines ?? [];

    // Merge with defaults (keep colors/icons from defaults, only update date/label)
    const merged = DEFAULT_DEADLINES.map((def) => {
      const aiUpdate = updates.find((u) => u.id === def.id);
      if (aiUpdate?.date) {
        return { ...def, date: aiUpdate.date, sublabel: aiUpdate.sublabel ?? def.sublabel };
      }
      return def;
    });

    await env.CACHE.put("calendar_deadlines", JSON.stringify({
      deadlines: merged,
      updatedAt: new Date().toISOString(),
      source: "auto",
    }), { expirationTtl: 60 * 60 * 24 * 90 }); // 90 days
  } catch (err) {
    console.error("Deadlines auto-update failed:", err);
  }
}

// ─── Season gate ─────────────────────────────────────────────────────────────

const MONITORING_START_MONTH = 6; // June (1-indexed)
const MONITORING_START_DAY = 17;  // June 17 = Bac results day
const MONITORING_END_MONTH = 9;   // Stop after August 31 (September onwards = off-season)

function isMonitoringSeason(now: Date): boolean {
  const m = now.getMonth() + 1; // 1-12
  const d = now.getDate();
  // June 17 onwards
  if (m === MONITORING_START_MONTH && d < MONITORING_START_DAY) return false;
  // July, August: always active
  if (m > MONITORING_START_MONTH && m < MONITORING_END_MONTH) return true;
  // June from day 17: active
  if (m === MONITORING_START_MONTH && d >= MONITORING_START_DAY) return true;
  return false;
}

// Track which schools have confirmed published their seuils (admin marks complete)
async function isMonitoringComplete(env: Env): Promise<boolean> {
  const flag = await env.CACHE.get("seuils_monitoring_complete");
  if (!flag) return false;
  // Auto-reset each year: compare year stored vs current year
  const parsed = JSON.parse(flag) as { year: number };
  return parsed.year === new Date().getFullYear();
}

export async function handleScheduled(env: Env): Promise<void> {
  const now = new Date();
  console.log("Scheduled job started at", now.toISOString());

  // Deadlines update runs year-round (lightweight, skips if fresh)
  const deadlineUpdate = runDeadlinesAutoUpdate(env);

  // Seuils monitoring: only during peak season, stop when admin marks complete
  const doSeuils = isMonitoringSeason(now) && !(await isMonitoringComplete(env));

  if (doSeuils) {
    console.log("In seuils monitoring season — running AI suggest");
    await Promise.allSettled([runSugilsAutoSuggest(env), deadlineUpdate]);
  } else {
    const reason = !isMonitoringSeason(now) ? "off-season" : "monitoring marked complete";
    console.log(`Skipping seuils suggest (${reason})`);
    await deadlineUpdate;
  }

  console.log("Scheduled job completed at", new Date().toISOString());
}

export { DEFAULT_DEADLINES };
