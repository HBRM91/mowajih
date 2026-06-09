-- Extended grade fields for detailed per-subject matching
ALTER TABLE "students" ADD COLUMN "french_grade" REAL;
ALTER TABLE "students" ADD COLUMN "arabic_grade" REAL;
ALTER TABLE "students" ADD COLUMN "philosophy_grade" REAL;
ALTER TABLE "students" ADD COLUMN "biology_grade" REAL;
ALTER TABLE "students" ADD COLUMN "economics_grade" REAL;
ALTER TABLE "students" ADD COLUMN "history_grade" REAL;
ALTER TABLE "students" ADD COLUMN "tech_grade" REAL;
ALTER TABLE "students" ADD COLUMN "english_grade" REAL;

-- Optional contact info (populated only when student consents to profile generation)
ALTER TABLE "students" ADD COLUMN "first_name" TEXT;
ALTER TABLE "students" ADD COLUMN "last_name" TEXT;
ALTER TABLE "students" ADD COLUMN "email_contact" TEXT;

-- AI simulation results stored as JSON (probability, confidence, rationale per school)
ALTER TABLE "students" ADD COLUMN "ai_results" TEXT;

-- Indexes for admin queries
CREATE INDEX IF NOT EXISTS "students_created_at_idx" ON "students" ("created_at");
CREATE INDEX IF NOT EXISTS "students_bac_track_idx" ON "students" ("bac_track");
CREATE INDEX IF NOT EXISTS "students_mention_idx" ON "students" ("mention");
