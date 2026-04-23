import type { SourceAttribution } from '../types/civic';

/**
 * Source Attribution Enforcement Middleware
 * 
 * Responsibilities:
 * - Verifies that civic data has valid authority metadata
 * - Rejects data lacking required source fields
 * - Prevents speculative or hallucinated deadlines
 */
export const validateCivicSource = (data: unknown): data is { source: SourceAttribution } => {
  if (!data || typeof data !== 'object') return false;
  
  const potentialData = data as { source?: SourceAttribution };
  const source = potentialData.source;
  
  if (!source) {
    console.warn('⚠️ Citation Warning: Data rejected due to missing SourceAttribution metadata.');
    return false;
  }

  if (!source.authority_name || !source.authority_url || !source.last_verified_timestamp) {
    console.warn('⚠️ Integrity Warning: Data source metadata is incomplete.');
    return false;
  }

  // Ensure last_verified_timestamp is valid ISO
  const d = new Date(source.last_verified_timestamp);
  if (isNaN(d.getTime())) {
    console.warn('⚠️ Integrity Warning: Invalid verification timestamp.');
    return false;
  }

  return true;
};

/**
 * Higher-order function to filter authoritative datasets only
 */
export const filterAuthoritative = <T>(items: T[]): T[] => {
  return items.filter(item => validateCivicSource(item));
};

/**
 * Standardizes source display for the UI
 */
export const formatAttribution = (source: SourceAttribution): string => {
  const date = new Date(source.last_verified_timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  return `Verified by ${source.authority_name} on ${date}`;
};

