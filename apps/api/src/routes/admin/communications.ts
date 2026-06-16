import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { students } from "@tawjih/shared";
import { adminAuth } from "../../middleware/adminAuth";
import { validate } from "../../middleware/validate";
import type { Env } from "../../types/env";

const followUpSchema = z.object({
  studentUuid: z.string().uuid().optional(),
  studentContext: z.object({
    firstName: z.string().optional(),
    bacTrack: z.string(),
    generalGrade: z.number(),
    mention: z.string(),
    city: z.string(),
    topSchools: z.array(z.string()).max(3),
    financialBracket: z.string(),
  }).optional(),
  channel: z.enum(["email", "sms", "whatsapp"]),
  tone: z.enum(["formal", "friendly", "urgent"]),
  objective: z.enum(["followup", "encourage", "deadline_reminder"]),
});

const pitchSchema = z.object({
  schoolName: z.string().min(1).max(100),
  schoolSlug: z.string().max(80),
  statsContext: z.object({
    totalConsentLeads: z.number(),
    topTracks: z.array(z.string()),
    avgGrade: z.number(),
    topCities: z.array(z.string()),
    mentionBreakdown: z.string(),
  }),
  tone: z.enum(["formal", "friendly"]),
  proposalType: z.enum(["discovery", "offer", "follow_up"]),
});

interface GeminiResp {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

const app = new Hono<{ Bindings: Env }>();

// POST /api/admin/communications/followup — personalized student follow-up email/SMS
app.post("/followup", adminAuth(), validate("json", followUpSchema), async (c) => {
  const body = c.req.valid("json");

  let ctx = body.studentContext;

  // If UUID provided, fetch live from DB
  if (body.studentUuid && !ctx) {
    const db = drizzle(c.env.DB);
    const student = await db.select({
      firstName: students.firstName,
      bacTrack: students.bacTrack,
      generalGrade: students.generalGrade,
      mention: students.mention,
      city: students.city,
      financialBracket: students.financialBracket,
      aiResults: students.aiResults,
    }).from(students).where(eq(students.uuid, body.studentUuid)).get();

    if (student) {
      ctx = {
        firstName: student.firstName ?? undefined,
        bacTrack: student.bacTrack,
        generalGrade: student.generalGrade,
        mention: student.mention,
        city: student.city,
        topSchools: (student.aiResults?.matches ?? [])
          .sort((a, b) => b.probability - a.probability)
          .slice(0, 3)
          .map((m) => m.university_slug),
        financialBracket: student.financialBracket,
      };
    }
  }

  if (!ctx) return c.json({ error: "No student context provided" }, 400);

  const greetName = ctx.firstName ? `${ctx.firstName}` : "étudiant(e)";
  const schoolList = ctx.topSchools.join(", ").toUpperCase().replace(/-/g, " ");

  const objectiveText = {
    followup: "rappeler à l'étudiant(e) les résultats de sa simulation et l'encourager à postuler",
    encourage: "motiver l'étudiant(e) à agir maintenant avant les dates limites",
    deadline_reminder: "alerter l'étudiant(e) sur les dates limites d'inscription imminentes (cursussup, TAFEM, etc.)",
  }[body.objective];

  const channelInstructions = {
    email: "email structuré avec Objet: (ligne), Corps: (paragraphes), Signature: JAD2 TAWJIH",
    sms: "SMS en 1 seule phrase < 160 caractères (pas de sujet, pas de signature longue)",
    whatsapp: "message WhatsApp décontracté et court, peut utiliser quelques emojis",
  }[body.channel];

  const prompt = `Tu es le conseiller IA de JAD2 TAWJIH, plateforme d'orientation académique marocaine.

Profil de l'étudiant(e) :
- Prénom : ${greetName}
- Filière Bac : ${ctx.bacTrack}
- Note générale : ${ctx.generalGrade}/20 (${ctx.mention})
- Ville : ${ctx.city}
- Budget mensuel : ${ctx.financialBracket} MAD
- Écoles recommandées : ${schoolList || "non renseignées"}

Objectif : ${objectiveText}
Ton : ${body.tone === "formal" ? "formel et professionnel" : body.tone === "urgent" ? "urgent et direct" : "chaleureux et motivant"}
Format : ${channelInstructions}

RÈGLES STRICTES :
- Signe toujours "L'équipe JAD2 TAWJIH" ou "Slimane — JAD2 TAWJIH"
- Ne mentionne jamais de frais ou prix
- Si écoles CPGE/CNC (EMI, EHTP, ENSIAS, INPT) : précise que l'accès est via CPGE 2 ans + CNC
- Reste dans le contexte marocain (en français + quelques mots darija si ton chaleureux)

Réponds en JSON : { "subject": "...", "body": "...", "cta": "..." }`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${c.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024, responseMimeType: "application/json" },
        }),
      }
    );

    const data = (await res.json()) as GeminiResp;
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(raw) as { subject?: string; body?: string; cta?: string };

    return c.json({ channel: body.channel, subject: parsed.subject ?? "", body: parsed.body ?? raw, cta: parsed.cta ?? "" });
  } catch (err) {
    return c.json({ error: "AI generation failed", detail: String(err) }, 502);
  }
});

// POST /api/admin/communications/pitch — B2B pitch to a private school partner
app.post("/pitch", adminAuth(), validate("json", pitchSchema), async (c) => {
  const body = c.req.valid("json");

  const prompt = `Tu es le directeur commercial de JAD2 TAWJIH, plateforme d'orientation académique marocaine leader.
Tu rédiges un email de prospection B2B à destination du directeur des admissions de ${body.schoolName}.

DONNÉES LEADS DISPONIBLES (étudiants ayant consenti au partage) :
- Nombre total de leads qualifiés : ${body.statsContext.totalConsentLeads}
- Filières Bac principales : ${body.statsContext.topTracks.join(", ")}
- Note moyenne Bac : ${body.statsContext.avgGrade}/20
- Villes principales : ${body.statsContext.topCities.join(", ")}
- Mentions : ${body.statsContext.mentionBreakdown}

Type de proposition : ${
  body.proposalType === "discovery" ? "Présentation initiale — proposer un rendez-vous de découverte" :
  body.proposalType === "offer" ? "Offre commerciale — proposer un pack de leads qualifiés" :
  "Suivi après premier contact — relance commerciale"
}

Ton : ${body.tone === "formal" ? "très professionnel et formel" : "chaleureux et partenarial"}

Rédige un email B2B percutant avec :
- Objet accrocheur
- Introduction valorisant les données (pas les volumes seuls — la qualité, la pertinence)
- Proposition de valeur claire (leads pré-qualifiés, consentement explicite CNDP, profils académiques vérifiés)
- CTA concret (RDV, démo, envoi échantillon CSV)
- Signature : Hamza El Bouhali, Fondateur JAD2 Advisory · JAD2 TAWJIH

RÈGLES :
- Ne donne pas de prix dans l'email
- Mentionne la conformité CNDP (consentement explicite des étudiants)
- Reste professionnel mais créez un sentiment d'exclusivité et d'urgence (saison Tawjihi)

Réponds en JSON : { "subject": "...", "body": "...", "cta": "..." }`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${c.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 1200, responseMimeType: "application/json" },
        }),
      }
    );

    const data = (await res.json()) as GeminiResp;
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(raw) as { subject?: string; body?: string; cta?: string };

    return c.json({ subject: parsed.subject ?? "", body: parsed.body ?? raw, cta: parsed.cta ?? "" });
  } catch (err) {
    return c.json({ error: "AI generation failed", detail: String(err) }, 502);
  }
});

export default app;
