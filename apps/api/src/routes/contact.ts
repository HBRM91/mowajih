import { Hono } from "hono";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { rateLimit } from "../middleware/rateLimit";
import type { Env } from "../types/env";

const studentSchema = z.object({
  type: z.literal("student"),
  name: z.string().max(100).optional(),
  email: z.string().email().max(120),
  phone: z.string().max(20).optional(),
  requestType: z.enum(["orientation", "coaching", "question", "other"]),
  message: z.string().min(10).max(2000),
});

const b2bSchema = z.object({
  type: z.literal("b2b"),
  institutionName: z.string().min(2).max(150),
  contactName: z.string().min(2).max(100),
  role: z.string().max(80).optional(),
  email: z.string().email().max(120),
  phone: z.string().max(20).optional(),
  partnershipType: z.enum(["partnership", "data", "recruitment", "other"]),
  message: z.string().min(10).max(3000),
});

const contactSchema = z.discriminatedUnion("type", [studentSchema, b2bSchema]);

const app = new Hono<{ Bindings: Env }>();

app.post("/", rateLimit("contact"), validate("json", contactSchema), async (c) => {
  const body = c.req.valid("json");

  const uuid = crypto.randomUUID();
  const timestamp = Date.now();
  const paddedTs = String(timestamp).padStart(15, "0");

  const requestCategory = body.type === "student" ? body.requestType : body.partnershipType;
  const subject = `[JAD2 TAWJIH] ${requestCategory} — nouvelle demande`;

  // Format all form fields as plain text for the email body
  const lines: string[] = [];
  if (body.type === "student") {
    lines.push(
      `Type: Étudiant`,
      `Réf: ${uuid}`,
      `Date: ${new Date().toISOString()}`,
      `---`,
      `Type de demande: ${body.requestType}`,
      ...(body.name ? [`Prénom: ${body.name}`] : []),
      `Email: ${body.email}`,
      ...(body.phone ? [`Téléphone: ${body.phone}`] : []),
      `---`,
      `Message:`,
      body.message,
    );
  } else {
    lines.push(
      `Type: Établissement / B2B`,
      `Réf: ${uuid}`,
      `Date: ${new Date().toISOString()}`,
      `---`,
      `Type de partenariat: ${body.partnershipType}`,
      `Établissement: ${body.institutionName}`,
      `Contact: ${body.contactName}`,
      ...(body.role ? [`Poste: ${body.role}`] : []),
      `Email: ${body.email}`,
      ...(body.phone ? [`Téléphone: ${body.phone}`] : []),
      `---`,
      `Message:`,
      body.message,
    );
  }
  const emailText = lines.join("\n");

  // Initialize Resend inside the handler — CF Workers don't support top-level env binding access
  const { Resend } = await import("resend");
  const resend = new Resend(c.env.RESEND_API_KEY);
  try {
    // resend.emails.send() resolves with { data, error } — it does NOT throw on
    // API-level failures (e.g. unverified sending domain), so `error` must be
    // checked explicitly or a failed send is silently swallowed.
    const { error } = await resend.emails.send({
      from: "JAD2 TAWJIH <noreply@jad2advisory.com>",
      to: "Tawjih@jad2advisory.com",
      subject,
      text: emailText,
    });
    if (error) {
      console.error("[contact] Resend send returned an error:", error);
    }
  } catch (err) {
    // Relay failure is transparent to the user — log and continue
    console.error("[contact] Resend send failed:", err);
  }

  // Store zero-PII metadata only — no name, email, phone, or message in KV
  const metaKey = `contact:meta:${paddedTs}:${uuid}`;
  await c.env.CACHE.put(
    metaKey,
    JSON.stringify({ uuid, type: body.type, requestType: requestCategory, createdAt: new Date().toISOString(), read: false }),
    { expirationTtl: 60 * 60 * 24 * 365 * 2 },
  );

  return c.json({ ok: true, uuid }, 201);
});

export default app;
