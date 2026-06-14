import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { students } from "@tawjih/shared";
import { validate } from "../middleware/validate";
import { rateLimit } from "../middleware/rateLimit";
import type { Env } from "../types/env";

// Known school slugs — rejects fabricated/injection slugs from bots
const VALID_SCHOOL_SLUGS = new Set([
  "emi","ehtp","ensias","inpt","um6p","ensa-agadir","ensa-casablanca","ensa-fes","ensa-kenitra",
  "ensa-marrakech","ensa-oujda","ensa-safi","ensa-rabat","ensa-tetouan","ensam-casablanca",
  "ensam-meknes","iscae","encg-casablanca","encg-rabat","encg-agadir","encg-fes","encg-tangier",
  "encg-meknes","encg-laayoune","encg-oujda","iav-hassan-ii","ena-rabat","fm-rabat","fm-casablanca",
  "fm-fes","fm-marrakech","uir","al-akhawayn","hem","esith","mundiapolis","emsi","upf",
  "cpge-lydauto","cpge-moulay-youssef","cpge-my-abdellah","cpge-classe-preparatoire-rabat",
]);

const matchSchema = z.object({
  university_slug: z.string().max(80).refine(
    (s) => VALID_SCHOOL_SLUGS.has(s),
    { message: "Unknown school slug" }
  ),
  probability: z.number().min(0).max(1),
  confidence: z.enum(["high", "medium", "low"]),
  rationale: z.string().max(800),
  estimated_annual_cost_mad: z.number().min(0).max(500000),
});

const profileSchema = z.object({
  // Core bac data
  bacTrack: z.enum(["SM", "PC", "SVT", "SE", "SH", "STI", "L"]),
  generalGrade: z.number().min(0).max(20),
  mention: z.enum(["Passable", "Assez Bien", "Bien", "Très Bien"]).optional(),
  // Subject grades (all optional)
  mathGrade: z.number().min(0).max(20).optional(),
  physicsGrade: z.number().min(0).max(20).optional(),
  frenchGrade: z.number().min(0).max(20).optional(),
  arabicGrade: z.number().min(0).max(20).optional(),
  philosophyGrade: z.number().min(0).max(20).optional(),
  biologyGrade: z.number().min(0).max(20).optional(),
  economicsGrade: z.number().min(0).max(20).optional(),
  historyGrade: z.number().min(0).max(20).optional(),
  techGrade: z.number().min(0).max(20).optional(),
  englishGrade: z.number().min(0).max(20).optional(),
  // Profile
  city: z.string().min(1).max(60),
  region: z.string().min(1).max(100),
  financialBracket: z.enum(["<<3000", "3000-8000", "8000-15000", ">15000"]),
  // Optional contact info (only stored when student explicitly provides)
  firstName: z.string().max(60).optional(),
  lastName: z.string().max(60).optional(),
  emailContact: z.string().email().max(120).optional(),
  phoneContact: z.string().max(20).optional(),
  // Private school partner consent
  consentPrivateSchools: z.boolean().optional(),
  // Simulation results from client-side engine
  matches: z.array(matchSchema).max(12),
  alternatives: z.array(z.object({
    name: z.string(),
    type: z.string(),
    reason: z.string(),
  })).max(6),
  suggested_tracks: z.array(z.string()).max(6),
});

const app = new Hono<{ Bindings: Env }>();

app.post("/", rateLimit("evaluate"), validate("json", profileSchema), async (c) => {
  const body = c.req.valid("json");

  const mention = body.mention ?? computeMention(body.generalGrade);
  const retentionExpiry = new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000); // 24 months

  const db = drizzle(c.env.DB);

  const student = await db
    .insert(students)
    .values({
      bacTrack: body.bacTrack,
      generalGrade: body.generalGrade,
      mention,
      mathGrade: body.mathGrade ?? null,
      physicsGrade: body.physicsGrade ?? null,
      frenchGrade: body.frenchGrade ?? null,
      arabicGrade: body.arabicGrade ?? null,
      philosophyGrade: body.philosophyGrade ?? null,
      biologyGrade: body.biologyGrade ?? null,
      economicsGrade: body.economicsGrade ?? null,
      historyGrade: body.historyGrade ?? null,
      techGrade: body.techGrade ?? null,
      englishGrade: body.englishGrade ?? null,
      city: body.city as "Casablanca" | "Rabat" | "Marrakech" | "Fès" | "Tanger" | "Agadir" | "Oujda" | "Tétouan" | "Salé" | "Meknès",
      region: body.region,
      financialBracket: body.financialBracket,
      firstName: body.firstName ?? null,
      lastName: body.lastName ?? null,
      emailContact: body.emailContact ?? null,
      phoneContact: body.phoneContact ?? null,
      consentPrivateSchools: body.consentPrivateSchools === true,
      consentPrivateAt: body.consentPrivateSchools ? new Date() : null,
      aiResults: {
        matches: body.matches,
        alternatives: body.alternatives,
        suggested_tracks: body.suggested_tracks,
      },
      cndpAnonymizedSummary: `Bac ${body.bacTrack}, ${mention}, ${body.city}`,
      retentionExpiry,
    })
    .returning({ uuid: students.uuid })
    .get();

  return c.json({ profileUuid: student.uuid }, 201);
});

function computeMention(grade: number): "Passable" | "Assez Bien" | "Bien" | "Très Bien" {
  if (grade >= 16) return "Très Bien";
  if (grade >= 14) return "Bien";
  if (grade >= 12) return "Assez Bien";
  return "Passable";
}

export default app;
