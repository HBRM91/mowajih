-- Migration 0002: Private school consent + phone contact
-- Allows students to opt-in to lead sharing with private school partners

ALTER TABLE students ADD COLUMN phone_contact TEXT;
ALTER TABLE students ADD COLUMN consent_private_schools INTEGER NOT NULL DEFAULT 0;
ALTER TABLE students ADD COLUMN consent_private_at INTEGER;
