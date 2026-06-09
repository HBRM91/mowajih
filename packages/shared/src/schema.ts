import { sqliteTable, integer, text, real, blob, uniqueIndex } from "drizzle-orm/sqlite-core";

// Students — CNDP anonymized core
export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique().$defaultFn(() => crypto.randomUUID()),
  bacTrack: text("bac_track", { enum: ["SM", "PC", "SVT", "SE", "SH", "STI", "L"] }).notNull(),
  mathGrade: real("math_grade"),
  physicsGrade: real("physics_grade"),
  generalGrade: real("general_grade").notNull(),
  mention: text("mention", { enum: ["Passable", "Assez Bien", "Bien", "Très Bien"] }).notNull(),
  city: text("city", { enum: ["Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir","Oujda","Tétouan","Salé","Meknès"] }).notNull(),
  region: text("region").notNull(),
  financialBracket: text("financial_bracket", { enum: ["<<3000","3000-8000","8000-15000",">15000"] }).notNull(),
  interestsVector: blob("interests_vector", { mode: "json" }),
  // Extended subject grades (added in migration 0001)
  frenchGrade: real("french_grade"),
  arabicGrade: real("arabic_grade"),
  philosophyGrade: real("philosophy_grade"),
  biologyGrade: real("biology_grade"),
  economicsGrade: real("economics_grade"),
  historyGrade: real("history_grade"),
  techGrade: real("tech_grade"),
  englishGrade: real("english_grade"),
  // Optional contact info — only stored with explicit consent for dossier generation
  firstName: text("first_name"),
  lastName: text("last_name"),
  emailContact: text("email_contact"),
  // AI simulation results as JSON
  aiResults: text("ai_results", { mode: "json" }).$type<{
    matches: Array<{ university_slug: string; probability: number; confidence: string; rationale: string; estimated_annual_cost_mad: number }>;
    alternatives: Array<{ name: string; type: string; reason: string }>;
    suggested_tracks: string[];
  }>(),
  cndpAnonymizedSummary: text("cndp_anonymized_summary").notNull(),
  retentionExpiry: integer("retention_expiry", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;

// Universities — B2B clients
export const universities = sqliteTable("universities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  tier: text("tier", { enum: ["premium","selective","standard","accessible"] }).notNull(),
  requiredSeuil: real("required_seuil").notNull(),
  bacTracksAccepted: text("bac_tracks_accepted", { mode: "json" }).notNull().$type<string[]>(),
  optInCost: integer("opt_in_cost").notNull(),
  monthlyQuota: integer("monthly_quota").notNull().default(50),
  embedding: blob("embedding", { mode: "json" }),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type University = typeof universities.$inferSelect;
export type NewUniversity = typeof universities.$inferInsert;

// Leads — The matching bridge
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentUuid: text("student_uuid").notNull(),
  universityId: integer("university_id").notNull().references(() => universities.id),
  matchProbability: real("match_probability").notNull(),
  matchType: text("match_type", { enum: ["rule_based","semantic","hybrid"] }).notNull(),
  aiRationale: text("ai_rationale").notNull(),
  hasOptedIn: integer("has_opted_in", { mode: "boolean" }).default(false),
  optInAt: integer("opt_in_at", { mode: "timestamp" }),
  contactUnlockedAt: integer("contact_unlocked_at", { mode: "timestamp" }),
  status: text("status", { enum: ["new","contacted","converted","dormant"] }).default("new"),
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (table) => ({
  unq: uniqueIndex("leads_student_university_unique").on(table.studentUuid, table.universityId),
}));

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

// Audit Logs — CNDP mandatory
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actorType: text("actor_type", { enum: ["student","dean","system","ai"] }).notNull(),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  metadata: text("metadata", { mode: "json" }),
  ipHash: text("ip_hash"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type AuditLog = typeof auditLogs.$inferSelect;

// AI Logs — Observability
export const aiLogs = sqliteTable("ai_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  modelUsed: text("model_used").notNull(),
  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  latencyMs: integer("latency_ms").notNull(),
  status: text("status", { enum: ["success","fallback","error","cached"] }).notNull(),
  errorMessage: text("error_message"),
  cached: integer("cached", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type AiLog = typeof aiLogs.$inferSelect;

// Admin AI Conversations — For the co-pilot memory
export const adminConversations = sqliteTable("admin_conversations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deanEmail: text("dean_email").notNull(),
  universityId: integer("university_id"),
  messages: text("messages", { mode: "json" }).notNull().$type<Array<{role:string;content:string;timestamp:string}>>(),
  contextSnapshot: text("context_snapshot", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type AdminConversation = typeof adminConversations.$inferSelect;
