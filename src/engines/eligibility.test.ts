import { describe, it, expect } from 'vitest';
import { checkEligibility } from './eligibility';

describe('Eligibility Engine', () => {
  it('should return eligible for citizens over 18', () => {
    const result = checkEligibility({ age: 19, citizenship: 'Indian' });
    expect(result.is_eligible).toBe(true);
  });

  it('should return ineligible for non-citizens', () => {
    const result = checkEligibility({ age: 19, citizenship: 'Other' });
    expect(result.is_eligible).toBe(false);
    expect(result.reason).toContain('citizen');
  });

  it('should return ineligible for minors', () => {
    const result = checkEligibility({ age: 17, citizenship: 'Indian' });
    expect(result.is_eligible).toBe(false);
    expect(result.reason).toContain('18');
  });
});
