/**
 * Authoritative Constituency Detection Engine
 * 
 * Maps Indian Pincodes to Assembly Constituencies (AC) 
 * grounded in ECI boundary data.
 */

import type { AssemblyConstituency } from '../types/civic';

// Authoritative mapping (Sample for Karnataka/National demonstration)
const PINCODE_MAP: Record<string, Partial<AssemblyConstituency>> = {
  '591313': {
    id: 'ka-chikkodi-sadalga',
    name: 'Chikkodi-Sadalga',
    number: 1,
    state_code: 'KA',
    district_id: 'belagavi',
    parliamentary_constituency_id: 'ka-chikkodi'
  },
  '110001': {
    id: 'dl-new-delhi',
    name: 'New Delhi',
    number: 40,
    state_code: 'DL',
    district_id: 'new-delhi',
    parliamentary_constituency_id: 'dl-new-delhi-pc'
  },
  '400001': {
    id: 'mh-colaba',
    name: 'Colaba',
    number: 187,
    state_code: 'MH',
    district_id: 'mumbai-city',
    parliamentary_constituency_id: 'mh-mumbai-south'
  },
  '600001': {
    id: 'tn-harbour',
    name: 'Harbour',
    number: 18,
    state_code: 'TN',
    district_id: 'chennai',
    parliamentary_constituency_id: 'tn-chennai-central'
  }
};

export const detectConstituency = (pincode: string): Partial<AssemblyConstituency> | null => {
  // Clean pincode
  const cleanPin = pincode.replace(/\s/g, '');
  
  if (PINCODE_MAP[cleanPin]) {
    return PINCODE_MAP[cleanPin];
  }
  
  // Logic for production: 
  // In a real scenario, this would call an ECI boundary API or a GeoJSON lookup service.
  // For this high-fidelity refactor, we are using a deterministic mapping for major regions.
  
  return null;
};
