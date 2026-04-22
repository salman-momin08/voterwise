import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectElectionLifecycle } from './lifecycle';
import type { Election } from '../types/civic';

describe('Election Lifecycle Engine', () => {
  const mockElection: Election = {
    id: 'test-2026',
    title: 'Test Election 2026',
    type: 'general',
    year: 2026,
    results_declared: false,
    source: {
      authority_name: 'ECI',
      authority_url: 'https://eci.gov.in',
      last_verified_timestamp: new Date().toISOString()
    },
    phases: [
      {
        id: 'p1',
        phase_number: 1,
        nomination_start: '2026-04-01T00:00:00Z',
        nomination_end: '2026-04-05T00:00:00Z',
        scrutiny_date: '2026-04-06T00:00:00Z',
        withdrawal_date: '2026-04-07T00:00:00Z',
        polling_date: '2026-04-15T00:00:00Z',
        counting_date: '2026-04-18T00:00:00Z',
        states: ['State A'],
        constituencies: ['C1'],
        source: {
          authority_name: 'ECI',
          authority_url: 'https://eci.gov.in',
          last_verified_timestamp: new Date().toISOString()
        }
      }
    ]
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return schedule_not_announced when no election is provided', () => {
    expect(detectElectionLifecycle(null)).toBe('schedule_not_announced');
  });

  it('should return revision_cycle_active before nomination starts', () => {
    vi.setSystemTime(new Date('2026-03-15T00:00:00Z'));
    expect(detectElectionLifecycle(mockElection)).toBe('revision_cycle_active');
  });

  it('should return nomination_phase_active during nomination period', () => {
    vi.setSystemTime(new Date('2026-04-03T00:00:00Z'));
    expect(detectElectionLifecycle(mockElection)).toBe('nomination_phase_active');
  });

  it('should return campaign_phase_active after nomination but before polling', () => {
    vi.setSystemTime(new Date('2026-04-10T00:00:00Z'));
    expect(detectElectionLifecycle(mockElection)).toBe('campaign_phase_active');
  });

  it('should return polling_active on polling day', () => {
    vi.setSystemTime(new Date('2026-04-15T10:00:00Z'));
    expect(detectElectionLifecycle(mockElection)).toBe('polling_active');
  });

  it('should return counting_active after polling but before counting completion', () => {
    vi.setSystemTime(new Date('2026-04-17T00:00:00Z'));
    expect(detectElectionLifecycle(mockElection)).toBe('counting_active');
  });

  it('should return completed after counting date', () => {
    vi.setSystemTime(new Date('2026-04-19T00:00:00Z'));
    expect(detectElectionLifecycle(mockElection)).toBe('completed');
  });
});
