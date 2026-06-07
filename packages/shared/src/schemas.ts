import { z } from "zod";

export const evaluateInputSchema = z.object({
  bacTrack: z.enum(["SM", "PC", "SVT", "SE", "SH", "STI", "L"]),
  mathGrade: z.number().min(0).max(20).optional(),
  physicsGrade: z.number().min(0).max(20).optional(),
  generalGrade: z.number().min(0).max(20),
  city: z.enum(["Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir","Oujda","Tétouan","Salé","Meknès"]),
  region: z.string().min(1),
  financialBracket: z.enum(["<<3000","3000-8000","8000-15000",">15000"]),
  interestsVector: z.array(z.number()).optional(),
  turnstileToken: z.string().min(1),
  consent: z.literal(true),
});

export const evaluateOutputSchema = z.object({
  studentUuid: z.string().uuid(),
  matches: z.array(z.object({
    university_slug: z.string(),
    probability: z.number().min(0).max(1),
    confidence: z.enum(["high", "medium", "low"]),
    rationale: z.string(),
    estimated_annual_cost_mad: z.number(),
  })),
  alternatives: z.array(z.object({
    name: z.string(),
    type: z.enum(["public", "private", "vocational"]),
    reason: z.string(),
  })),
  suggested_tracks: z.array(z.string()),
});

export const assistantInputSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
  universityId: z.number().int().positive(),
  stream: z.boolean().default(false),
});

export const leadUpdateSchema = z.object({
  status: z.enum(["new","contacted","converted","dormant"]).optional(),
  notes: z.string().optional(),
});

export const communicationDraftSchema = z.object({
  leadUuid: z.string().uuid(),
  channel: z.enum(["email", "sms"]),
  tone: z.enum(["formal", "friendly"]),
  universityName: z.string().min(1),
  deanName: z.string().min(1),
});

export type EvaluateInput = z.infer<typeof evaluateInputSchema>;
export type EvaluateOutput = z.infer<typeof evaluateOutputSchema>;
export type AssistantInput = z.infer<typeof assistantInputSchema>;
export type LeadUpdate = z.infer<typeof leadUpdateSchema>;
export type CommunicationDraft = z.infer<typeof communicationDraftSchema>;
