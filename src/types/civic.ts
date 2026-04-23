export type ElectionLifecycleStatus = 
  | 'schedule_not_announced' 
  | 'revision_cycle_active' 
  | 'nomination_phase_active' 
  | 'campaign_phase_active' 
  | 'polling_active' 
  | 'counting_active' 
  | 'completed';

export interface SourceAttribution {
  authority_name: string;
  authority_url: string;
  last_verified_timestamp: string; // ISO string
}

export interface EligibilityInput {
  age?: number;
  citizenship?: string;
  is_of_sound_mind?: boolean;
  is_convicted_of_electoral_offense?: boolean;
}

export interface EligibilityResult {
  is_eligible: boolean;
  reason?: string;
  next_steps?: string[];
  form_type?: 'form_6' | 'form_6a' | 'form_7' | 'form_8';
  source: SourceAttribution;
}


export interface IndianState {
  code: string;
  name: string;
  ceo_portal_url: string;
  source: SourceAttribution;
}

export interface District {
  id: string;
  name: string;
  state_code: string;
  source: SourceAttribution;
}

export interface ElectionPhase {
  id: string;
  phase_number: number;
  states: string[];
  constituencies: string[];
  nomination_start: string;
  nomination_end: string;
  scrutiny_date: string;
  withdrawal_date: string;
  polling_date: string;
  counting_date: string;
  source: SourceAttribution;
}

export interface Election {
  id: string;
  title: string;
  type: 'general' | 'assembly' | 'bye-election';
  year: number;
  announced_date?: string;
  phases?: ElectionPhase[];
  results_declared: boolean;
  source: SourceAttribution;
}

export interface ConstituencyMember {
  id: string;
  name: string;
  party: string;
  role: 'MP' | 'MLA';
  constituency_id: string;
  state_code: string;
  official_profile_url: string;
  source: SourceAttribution;
  affidavit_url?: string;
  assets?: string;
  criminal_cases?: number;
  education?: string;
}

export interface RegistrationCycle {
  id: string;
  title: string;
  revision_type: 'summary' | 'special' | 'continuous';
  start_date: string;
  end_date: string;
  qualifying_date: string;
  is_active: boolean;
  source: SourceAttribution;
}

export interface EPICWorkflow {
  form_type: 'form_6' | 'form_6a' | 'form_7' | 'form_8';
  title: string;
  description: string;
  steps: EPICStep[];
  source: SourceAttribution;
}

export interface EPICStep {
  step_number: number;
  title: string;
  description: string;
  required_documents: string[];
  portal_url: string;
  estimated_processing_days: number;
  source: SourceAttribution;
}

export interface AssemblyConstituency {
  id: string;
  name: string;
  number: number;
  district_id: string;
  state_code: string;
  parliamentary_constituency_id: string;
  source: SourceAttribution;
}

export interface ParliamentaryConstituency {
  id: string;
  name: string;
  state_code: string;
  source: SourceAttribution;
}

export interface PollingStation {
  id: string;
  name: string;
  address: string;
  constituency_id: string;
  location_url?: string;
  google_maps_url?: string;
  latitude?: number;
  longitude?: number;
  booth_number?: string;
  source: SourceAttribution;
}

export interface CivicDeadline {
  id: string;
  title: string;
  date: string;
  type: 'registration' | 'nomination' | 'polling' | 'counting';
  source: SourceAttribution;
}

export type WorkflowStepId = 
  | 'eligibility' 
  | 'address' 
  | 'constituency' 
  | 'registration_status' 
  | 'epic_registration' 
  | 'polling_lookup' 
  | 'election_schedule'
  | 'polling_checklist'
  | 'status';

export interface WorkflowState {
  current_step: WorkflowStepId;
  completed_steps: WorkflowStepId[];
  constituency?: AssemblyConstituency;
  eligibility_result?: EligibilityResult;
  user_data?: {
    age?: number;
    citizenship?: string;
    address?: string;
    state?: string;
    district?: string;
  };
}



