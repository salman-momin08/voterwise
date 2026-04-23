import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectElectionLifecycle } from './lifecycle';
import { Election } from '../types/civic';

describe('Lifecycle Engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return schedule_not_announced if no phases are present', () => {
    const election: Partial<Election> = { phases: [] };
    const result = detectElectionLifecycle(election as Election);
    expect(result).toBe('schedule_not_announced');
  });

  it('should identify polling_active on election day', () => {
    const election: Partial<Election> = {
      phases: [
        {
          id: '1',
          name: 'Phase 1',
          nomination_start: '2024-01-01',
          withdrawal_date: '2024-01-05',
          polling_date: '2024-01-10',
          counting_date: '2024-01-12'
        }
      ]
    };
    vi.setSystemTime(new Date('2024-01-10T10:00:00'));
    const result = detectElectionLifecycle(election as Election);
    expect(result).toBe('polling_active');
  });

  it('should identify completed after results declared with phases present', () => {
    const election: Partial<Election> = {
      results_declared: true,
      phases: [
        {
          id: '1',
          name: 'Phase 1',
          nomination_start: '2024-01-01',
          withdrawal_date: '2024-01-05',
          polling_date: '2024-01-10',
          counting_date: '2024-01-12'
        }
      ]
    };
    const result = detectElectionLifecycle(election as Election);
    expect(result).toBe('completed');
  });
});
