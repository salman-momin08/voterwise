import type { Election, ElectionLifecycleStatus } from '../types/civic';

/**
 * Election Lifecycle Detection Engine
 * 
 * Dynamically computes the status of an election based on authoritative ECI dates
 * and the current runtime timestamp. 
 * 
 * Does NOT assume a schedule exists unless data is present.
 */
/**
 * Election Lifecycle Detection Engine
 * 
 * Dynamically computes the status of an election based on authoritative ECI dates
 * and the current runtime timestamp. 
 * 
 * Lifecycle States:
 * - schedule_not_announced
 * - revision_cycle_active
 * - nomination_phase_active
 * - campaign_phase_active
 * - polling_active
 * - counting_active
 * - completed
 */
export const detectElectionLifecycle = (election: Election | null): ElectionLifecycleStatus => {
  if (!election || !election.phases || election.phases.length === 0) {
    // If no election schedule exists in cache, check if there's an active revision cycle
    // (In production, this would check the /revision_cycles collection)
    return 'schedule_not_announced';
  }

  const now = new Date();
  
  // Sort phases to get boundary dates
  const sortedPhases = [...election.phases].sort((a, b) => 
    new Date(a.nomination_start).getTime() - new Date(b.nomination_start).getTime()
  );

  const firstNomination = new Date(sortedPhases[0].nomination_start);
  const lastPolling = new Date(sortedPhases[sortedPhases.length - 1].polling_date);
  const lastCounting = new Date(sortedPhases[sortedPhases.length - 1].counting_date);

  // 1. Completed
  if (election.results_declared || now > lastCounting) {
    return 'completed';
  }

  // 2. Polling (Specific day check takes precedence)
  const isPollingDay = election.phases.some(p => {
    const pDate = new Date(p.polling_date);
    return now.toDateString() === pDate.toDateString();
  });
  if (isPollingDay) return 'polling_active';

  // 3. Counting
  if (now > lastPolling && now <= lastCounting) {
    return 'counting_active';
  }

  // 4. Nomination or Campaign
  if (now >= firstNomination && now < lastPolling) {
    const isNominationActive = election.phases.some(p => 
      now >= new Date(p.nomination_start) && now <= new Date(p.withdrawal_date)
    );
    return isNominationActive ? 'nomination_phase_active' : 'campaign_phase_active';
  }

  // 5. Default state for announced but not started
  return 'revision_cycle_active';
};

/**
 * Registration Revision Cycle Awareness Engine
 */
export const detectRevisionCycleStatus = (currentCycle: any | null): string => {
  if (!currentCycle || !currentCycle.is_active) {
    return 'continuous_update_phase';
  }
  
  return currentCycle.revision_type === 'special' 
    ? 'special_revision_phase' 
    : 'summary_revision_phase';
};
