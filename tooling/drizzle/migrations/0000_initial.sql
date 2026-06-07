CREATE TABLE IF NOT EXISTS "students" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	"uuid" TEXT NOT NULL,
	"bac_track" TEXT NOT NULL,
	"math_grade" REAL,
	"physics_grade" REAL,
	"general_grade" REAL NOT NULL,
	"mention" TEXT NOT NULL,
	"city" TEXT NOT NULL,
	"region" TEXT NOT NULL,
	"financial_bracket" TEXT NOT NULL,
	"interests_vector" BLOB,
	"cndp_anonymized_summary" TEXT NOT NULL,
	"retention_expiry" INTEGER NOT NULL,
	"created_at" INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS "universities" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	"slug" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"short_name" TEXT NOT NULL,
	"city" TEXT NOT NULL,
	"region" TEXT NOT NULL,
	"tier" TEXT NOT NULL,
	"required_seuil" REAL NOT NULL,
	"bac_tracks_accepted" TEXT NOT NULL,
	"opt_in_cost" INTEGER NOT NULL,
	"monthly_quota" INTEGER DEFAULT 50 NOT NULL,
	"embedding" BLOB,
	"is_active" INTEGER DEFAULT true,
	"created_at" INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS "leads" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	"student_uuid" TEXT NOT NULL,
	"university_id" INTEGER NOT NULL,
	"match_probability" REAL NOT NULL,
	"match_type" TEXT NOT NULL,
	"ai_rationale" TEXT NOT NULL,
	"has_opted_in" INTEGER DEFAULT false,
	"opt_in_at" INTEGER,
	"contact_unlocked_at" INTEGER,
	"status" TEXT DEFAULT 'new',
	"assigned_to" TEXT,
	"notes" TEXT,
	"created_at" INTEGER DEFAULT (unixepoch()),
	FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	"actor_type" TEXT NOT NULL,
	"actor_id" TEXT,
	"action" TEXT NOT NULL,
	"resource_type" TEXT NOT NULL,
	"resource_id" TEXT NOT NULL,
	"metadata" TEXT,
	"ip_hash" TEXT,
	"created_at" INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS "ai_logs" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	"model_used" TEXT NOT NULL,
	"prompt_tokens" INTEGER,
	"completion_tokens" INTEGER,
	"latency_ms" INTEGER NOT NULL,
	"status" TEXT NOT NULL,
	"error_message" TEXT,
	"cached" INTEGER DEFAULT false,
	"created_at" INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS "admin_conversations" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	"dean_email" TEXT NOT NULL,
	"university_id" INTEGER,
	"messages" TEXT NOT NULL,
	"context_snapshot" TEXT,
	"created_at" INTEGER DEFAULT (unixepoch())
);

CREATE UNIQUE INDEX IF NOT EXISTS "universities_slug_unique" ON "universities" ("slug");
CREATE INDEX IF NOT EXISTS "leads_university_id_idx" ON "leads" ("university_id");
CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "leads" ("status");
CREATE INDEX IF NOT EXISTS "leads_student_uuid_idx" ON "leads" ("student_uuid");
CREATE INDEX IF NOT EXISTS "students_retention_expiry_idx" ON "students" ("retention_expiry");
CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs" ("created_at");
