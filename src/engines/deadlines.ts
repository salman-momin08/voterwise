/**
 * Dynamic Deadline Intelligence Engine.
 * Computes deadline status using runtime date — never static.
 */
import type { CivicDeadline } from '../types/civic';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

/** Mark deadlines as passed/active based on runtime date */
export function evaluateDeadlines(deadlines: CivicDeadline[]): CivicDeadline[] {
  const now = today();
  return deadlines.map((d) => ({
    ...d,
    is_passed: d.date < now,
    alternative_action: d.date < now
      ? getAlternativeAction(d.type)
      : undefined,
  }));
}

/** Get next upcoming deadline */
export function getNextDeadline(deadlines: CivicDeadline[]): CivicDeadline | null {
  const now = today();
  const upcoming = deadlines
    .filter((d) => d.date >= now)
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0] || null;
}

/** Get days until a deadline */
export function daysUntil(date: string): number {
  const now = new Date();
  const target = new Date(date);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getAlternativeAction(type: CivicDeadline['type']): string {
  switch (type) {
    case 'registration':
      return 'Registration for this phase has closed. You may register for the next electoral roll revision cycle.';
    case 'nomination':
      return 'The nomination window has closed for this phase.';
    case 'polling':
      return 'Polling for this phase is complete.';
    default:
      return 'This deadline has passed. Check for upcoming cycles.';
  }
}
