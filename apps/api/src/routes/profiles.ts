import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { students } from "@tawjih/shared";
import { validate } from "../middleware/validate";
import { rateLimit } from "../middleware/rateLimit";
import type { Env } from "../types/env";

// Known school slugs — rejects fabricated/injection slugs from bots
const VALID_SCHOOL_SLUGS = new Set([
  // Elite engineering — CNC
  "emi","ehtp","ensias","inpt","enim","insea",
  // ENSAM campuses
  "ensam-casablanca","ensam-meknes","ensam-rabat",
  // ENSA network (13 campuses)
  "ensa-agadir","ensa-fes","ensa-marrakech","ensa-kenitra","ensa-tanger","ensa-oujda",
  "ensa-beni-mellal","ensa-el-jadida","ensa-berrechid","ensa-khouribga","ensa-safi",
  "ensa-al-hoceima","ensa-tetouan","ensa-casablanca","ensa-rabat",
  // Business
  "iscae",
  "encg-casablanca","encg-agadir","encg-fes","encg-tanger","encg-marrakech","encg-oujda",
  "encg-settat","encg-kenitra","encg-el-jadida","encg-beni-mellal","encg-dakhla",
  "encg-rabat","encg-meknes","encg-laayoune","encg-tangier",
  // Agriculture / architecture / medicine
  "iav-hassan-ii",
  "ena-rabat","ena-fes","ena-marrakech","ena-agadir","ena-tetouan","ena-oujda",
  "fm-rabat","fm-casablanca","fm-fes","fm-marrakech","fm-oujda","fm-tanger","fm-agadir",
  "fmd-rabat","fmd-casablanca","fmd-fes",
  "ispits",
  // Private / international
  "um6p","uir","al-akhawayn","hem","esith","mundiapolis","emsi","upf","upm","um6ss","esisa",
  // CPGE schools
  "cpge-moulay-youssef","cpge-ferhat-hachad","cpge-alkindi-tanger","cpge-ibn-youssef","cpge-oujda",
  // Arts / communication
  "isit-tanger","isic-rabat","inba-tetouan","isadac","esav-marrakech",
  // Engineering / tech private
  "enset-mohammedia","esca-casablanca","cesem-casablanca","supdeco-maroc","ipes-casablanca",
  "fp-rabat",
  // Public universities
  "fs-rabat","fsjes-casablanca","fsjes-agdal","fsjes-marrakech","fsjes-agadir","fsjes-fes",
  "fst-mohammedia","fst-fes","fst-marrakech","fst-agadir","fst-beni-mellal",
  "est-casablanca","est-sale","est-fes","est-meknes","est-agadir","est-oujda",
  "ista",
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

  // Defense-in-depth: strip PII when platform is in anonymous mode (no CNDP approval yet)
  const modeRaw = await c.env.CACHE.get("platform_data_mode");
  const isFullMode = modeRaw === "full";

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
      firstName: isFullMode ? (body.firstName ?? null) : null,
      lastName: isFullMode ? (body.lastName ?? null) : null,
      emailContact: isFullMode ? (body.emailContact ?? null) : null,
      phoneContact: isFullMode ? (body.phoneContact ?? null) : null,
      consentPrivateSchools: isFullMode ? body.consentPrivateSchools === true : false,
      consentPrivateAt: isFullMode && body.consentPrivateSchools ? new Date() : null,
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
