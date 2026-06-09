import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, desc, count, like, or } from "drizzle-orm";
import { students } from "@tawjih/shared";
import { adminAuth } from "../../middleware/adminAuth";
import type { Env } from "../../types/env";

const app = new Hono<{ Bindings: Env }>();

// List all profiles with pagination and search
app.get("/", adminAuth(), async (c) => {
  const db = drizzle(c.env.DB);
  const page = Math.max(1, parseInt(c.req.query("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(10, parseInt(c.req.query("limit") ?? "20", 10)));
  const search = c.req.query("search") ?? "";
  const track = c.req.query("track") ?? "";
  const offset = (page - 1) * limit;

  let query = db
    .select({
      uuid: students.uuid,
      bacTrack: students.bacTrack,
      generalGrade: students.generalGrade,
      mention: students.mention,
      city: students.city,
      region: students.region,
      financialBracket: students.financialBracket,
      firstName: students.firstName,
      lastName: students.lastName,
      emailContact: students.emailContact,
      mathGrade: students.mathGrade,
      physicsGrade: students.physicsGrade,
      frenchGrade: students.frenchGrade,
      arabicGrade: students.arabicGrade,
      biologyGrade: students.biologyGrade,
      economicsGrade: students.economicsGrade,
      techGrade: students.techGrade,
      englishGrade: students.englishGrade,
      createdAt: students.createdAt,
    })
    .from(students)
    .orderBy(desc(students.createdAt))
    .limit(limit)
    .offset(offset);

  const rows = await query.all();

  // Count total (for pagination)
  const totalRow = await db.select({ count: count() }).from(students).get();
  const total = totalRow?.count ?? 0;

  return c.json({
    profiles: rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// Get a single profile with full detail including AI results
app.get("/:uuid", adminAuth(), async (c) => {
  const uuid = c.req.param("uuid");
  const db = drizzle(c.env.DB);

  const profile = await db
    .select()
    .from(students)
    .where(eq(students.uuid, uuid))
    .get();

  if (!profile) return c.json({ error: "Profile not found" }, 404);
  return c.json(profile);
});

export default app;
