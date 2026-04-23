import { z } from 'zod';

export const SourceAttributionSchema = z.object({
  authority_name: z.string(),
  authority_url: z.url(),
  last_verified_timestamp: z.iso.datetime(),
});

export const IndianStateSchema = z.object({
  code: z.string().length(2),
  name: z.string(),
  ceo_portal_url: z.url(),
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
  nomination_start: z.iso.datetime(),
  nomination_end: z.iso.datetime(),
  scrutiny_date: z.iso.datetime(),
  withdrawal_date: z.iso.datetime(),
  polling_date: z.iso.datetime(),
  counting_date: z.iso.datetime(),
  source: SourceAttributionSchema,
});

export const ElectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['general', 'assembly', 'bye-election']),
  year: z.number().int().min(2024),
  announced_date: z.iso.datetime().optional(),
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
  official_profile_url: z.url(),
  source: SourceAttributionSchema,
  affidavit_url: z.url().optional(),
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
  location_url: z.url().optional(),
  google_maps_url: z.url().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  booth_number: z.string().optional(),
  source: SourceAttributionSchema,
});
