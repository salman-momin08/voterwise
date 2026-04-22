import { z } from 'zod';

export const SourceAttributionSchema = z.object({
  authority_name: z.string(),
  authority_url: z.string().url(),
  last_verified_timestamp: z.string().datetime(),
});

export const IndianStateSchema = z.object({
  code: z.string().length(2),
  name: z.string(),
  ceo_portal_url: z.string().url(),
  source: SourceAttributionSchema,
});

export const DistrictSchema = z.object({
  id: z.string(),
  name: z.string(),
  state_code: z.string().length(2),
  source: SourceAttributionSchema,
});

export const ElectionPhaseSchema = z.object({
  id: z.string(),
  phase_number: z.number().int().positive(),
  states: z.array(z.string()),
  constituencies: z.array(z.string()),
  nomination_start: z.string().datetime(),
  nomination_end: z.string().datetime(),
  scrutiny_date: z.string().datetime(),
  withdrawal_date: z.string().datetime(),
  polling_date: z.string().datetime(),
  counting_date: z.string().datetime(),
  source: SourceAttributionSchema,
});

export const ElectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['general', 'assembly', 'bye-election']),
  year: z.number().int().min(2024),
  announced_date: z.string().datetime().optional(),
  phases: z.array(ElectionPhaseSchema).optional(),
  results_declared: z.boolean(),
  source: SourceAttributionSchema,
});

export const ConstituencyMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  party: z.string(),
  role: z.enum(['MP', 'MLA']),
  constituency_id: z.string(),
  state_code: z.string().length(2),
  official_profile_url: z.string().url(),
  source: SourceAttributionSchema,
  affidavit_url: z.string().url().optional(),
  assets: z.string().optional(),
  criminal_cases: z.number().int().nonnegative().optional(),
  education: z.string().optional(),
});

export const AssemblyConstituencySchema = z.object({
  id: z.string(),
  name: z.string(),
  number: z.number().int().positive(),
  district_id: z.string(),
  state_code: z.string().length(2),
  parliamentary_constituency_id: z.string(),
  source: SourceAttributionSchema,
});

export const PollingStationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  constituency_id: z.string(),
  location_url: z.string().url().optional(),
  google_maps_url: z.string().url().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  source: SourceAttributionSchema,
});
