import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { students } from "@tawjih/shared";
import { adminAuth } from "../../middleware/adminAuth";
import { validate } from "../../middleware/validate";
import type { Env } from "../../types/env";

const dossierSchema = z.object({
  profileUuid: z.string().uuid(),
  schoolSlug: z.string().min(1).max(80),
  schoolName: z.string().min(1).max(120),
  language: z.enum(["fr", "ar"]).default("fr"),
});

const app = new Hono<{ Bindings: Env }>();

app.post("/", adminAuth(), validate("json", dossierSchema), async (c) => {
  const body = c.req.valid("json");
  const db = drizzle(c.env.DB);

  const profile = await db
    .select()
    .from(students)
    .where(eq(students.uuid, body.profileUuid))
    .get();

  if (!profile) return c.json({ error: "Profile not found" }, 404);

  const studentName = (profile.firstName && profile.lastName)
    ? `${profile.firstName} ${profile.lastName}`
    : "Étudiant(e)";

  const matchEntry = (profile.aiResults?.matches ?? []).find(
    (m) => m.university_slug === body.schoolSlug
  );

  const subjectGrades = buildGradeList(profile);

  const prompt = buildDossierPrompt({
    studentName,
    bacTrack: profile.bacTrack,
    generalGrade: profile.generalGrade,
    mention: profile.mention,
    city: profile.city,
    region: profile.region,
    financialBracket: profile.financialBracket,
    subjectGrades,
    schoolName: body.schoolName,
    schoolSlug: body.schoolSlug,
    matchProbability: matchEntry?.probability,
    matchRationale: matchEntry?.rationale,
    suggestedTracks: profile.aiResults?.suggested_tracks ?? [],
    language: body.language,
  });

  let dossierText = "";
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${c.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      }
    );
    interface GeminiResp {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    }
    const data = (await res.json()) as GeminiResp;
    dossierText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch {
    dossierText = buildFallbackDossier(studentName, body.schoolName, profile.bacTrack, profile.mention, body.language);
  }

  return c.json({
    profileUuid: body.profileUuid,
    schoolSlug: body.schoolSlug,
    schoolName: body.schoolName,
    studentName,
    dossier: dossierText,
    generatedAt: new Date().toISOString(),
  });
});

function buildGradeList(profile: typeof students.$inferSelect): string {
  const entries: string[] = [];
  if (profile.generalGrade) entries.push(`Moyenne générale: ${profile.generalGrade}/20`);
  if (profile.mathGrade != null) entries.push(`Mathématiques: ${profile.mathGrade}/20`);
  if (profile.physicsGrade != null) entries.push(`Physique-Chimie: ${profile.physicsGrade}/20`);
  if (profile.biologyGrade != null) entries.push(`Sciences de la Vie: ${profile.biologyGrade}/20`);
  if (profile.economicsGrade != null) entries.push(`Économie: ${profile.economicsGrade}/20`);
  if (profile.frenchGrade != null) entries.push(`Français: ${profile.frenchGrade}/20`);
  if (profile.arabicGrade != null) entries.push(`Arabe: ${profile.arabicGrade}/20`);
  if (profile.englishGrade != null) entries.push(`Anglais: ${profile.englishGrade}/20`);
  if (profile.philosophyGrade != null) entries.push(`Philosophie: ${profile.philosophyGrade}/20`);
  if (profile.techGrade != null) entries.push(`Sciences & Tech. Industrielles: ${profile.techGrade}/20`);
  if (profile.historyGrade != null) entries.push(`Histoire-Géographie: ${profile.historyGrade}/20`);
  return entries.join("\n");
}

interface DossierOptions {
  studentName: string;
  bacTrack: string;
  generalGrade: number;
  mention: string;
  city: string;
  region: string;
  financialBracket: string;
  subjectGrades: string;
  schoolName: string;
  schoolSlug: string;
  matchProbability?: number;
  matchRationale?: string;
  suggestedTracks: string[];
  language: "fr" | "ar";
}

function buildDossierPrompt(opts: DossierOptions): string {
  const lang = opts.language === "ar" ? "arabe" : "français";
  return `Tu es un conseiller d'orientation senior spécialisé dans les admissions aux grandes écoles marocaines.
Génère un dossier de candidature complet et professionnel en ${lang} pour l'étudiant suivant.

PROFIL ÉTUDIANT:
- Nom: ${opts.studentName}
- Filière Bac: ${opts.bacTrack}
- Mention: ${opts.mention} (${opts.generalGrade}/20)
- Ville: ${opts.city}, ${opts.region}
- Budget annuel: ${opts.financialBracket} MAD/mois

NOTES PAR MATIÈRE:
${opts.subjectGrades}

ÉCOLE CIBLE: ${opts.schoolName}
${opts.matchProbability ? `Probabilité d'admission estimée: ${Math.round(opts.matchProbability * 100)}%` : ""}
${opts.matchRationale ? `Analyse: ${opts.matchRationale}` : ""}

PARCOURS SUGGÉRÉS:
${opts.suggestedTracks.join("\n")}

---

Génère le dossier de candidature complet avec les sections suivantes (en ${lang}, formaté en Markdown propre):

## 1. LETTRE DE MOTIVATION
Une lettre de motivation personnalisée et convaincante (300–400 mots) adaptée à ${opts.schoolName}. Ton sincère, professionnel, motivé. Mentionner le profil académique spécifique (Bac ${opts.bacTrack}, mention ${opts.mention}), les aspirations professionnelles cohérentes avec la filière de l'école, et la valeur ajoutée apportée à l'établissement.

## 2. RÉSUMÉ ACADÉMIQUE
Synthèse structurée du parcours scolaire avec points forts académiques, compétences développées, et cohérence avec la filière choisie.

## 3. CHECKLIST DES PIÈCES JUSTIFICATIVES
Liste précise des documents requis pour ${opts.schoolName} avec case à cocher (format: - [ ] Document). Inclure: relevés de notes, acte de naissance, CIN, photos, diplôme bac, etc.

## 4. FORMULAIRE PRÉ-REMPLI
Données de candidature standardisées prêtes à copier dans les formulaires d'admission.

## 5. CONSEILS D'ENTRETIEN
5–7 conseils personnalisés pour réussir l'entretien de sélection à ${opts.schoolName}, basés sur le profil spécifique de l'étudiant.

## 6. CALENDAR D'ADMISSION
Dates clés et étapes importantes pour postuler à ${opts.schoolName} (basé sur le calendrier type des grandes écoles marocaines).

IMPORTANT: Le dossier doit être immédiatement utilisable. Ne mentionne aucun nom de modèle IA ou de service tiers dans le contenu généré.`;
}

function buildFallbackDossier(
  studentName: string,
  schoolName: string,
  bacTrack: string,
  mention: string,
  language: "fr" | "ar"
): string {
  if (language === "ar") {
    return `## دوسيه الترشح — ${schoolName}\n\n**اسم المترشح:** ${studentName}\n\n**الملف الدراسي:** باك ${bacTrack} — ملاحظة ${mention}\n\n## رسالة التحفيز\n\nالسيد/ة المحترم/ة،\n\nأتقدم بهذا الطلب للالتحاق بـ${schoolName} بصفتي حاملاً/ة لشهادة الباكالوريا فرع ${bacTrack} بتقدير ${mention}...\n\n## قائمة الوثائق المطلوبة\n- [ ] كشف النقط (3 سنوات ثانوي)\n- [ ] شهادة الباكالوريا\n- [ ] بطاقة التعريف الوطنية\n- [ ] شهادة الميلاد\n- [ ] صور شمسية\n- [ ] السيرة الذاتية\n\n*يُنصح بالتواصل مع مصلحة القبول في المؤسسة للحصول على القائمة الكاملة.*`;
  }
  return `## Dossier de Candidature — ${schoolName}\n\n**Candidat:** ${studentName}\n\n**Profil:** Bac ${bacTrack} — Mention ${mention}\n\n## Lettre de Motivation\n\nMadame, Monsieur,\n\nJe me permets de vous adresser ma candidature pour intégrer ${schoolName}. Titulaire du baccalauréat filière ${bacTrack} avec la mention ${mention}...\n\n## Checklist des Pièces\n- [ ] Relevés de notes (3 ans lycée)\n- [ ] Diplôme Baccalauréat\n- [ ] CIN\n- [ ] Acte de naissance\n- [ ] Photos d'identité\n- [ ] CV\n\n*Contacter le service des admissions de l'établissement pour la liste complète.*`;
}

export default app;
