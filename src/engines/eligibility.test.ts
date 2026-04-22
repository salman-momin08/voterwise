import { describe, it, expect } from 'vitest';
import { checkEligibility } from './eligibility';

describe('Eligibility Engine', () => {
  it('should grant eligibility for valid Indian citizens aged 18+', () => {
    const result = checkEligibility({
      age: 25,
      citizenship: 'India',
      is_of_sound_mind: true,
      is_convicted_of_electoral_offense: false
    });
    expect(result.is_eligible).toBe(true);
    expect(result.form_type).toBe('form_6');
  });

  it('should disqualify non-Indian citizens', () => {
    const result = checkEligibility({
      age: 25,
      citizenship: 'USA'
    });
    expect(result.is_eligible).toBe(false);
    expect(result.reason).toContain('Indian citizens');
  });

  it('should disqualify minors', () => {
    const result = checkEligibility({
      age: 17,
      citizenship: 'India'
    });
    expect(result.is_eligible).toBe(false);
    expect(result.reason).toContain('at least 18 years old');
  });

  it('should disqualify persons of unsound mind', () => {
    const result = checkEligibility({
      age: 25,
      citizenship: 'India',
      is_of_sound_mind: false
    });
    expect(result.is_eligible).toBe(false);
    expect(result.reason).toContain('unsound mind');
  });

  it('should disqualify persons with electoral offenses', () => {
    const result = checkEligibility({
      age: 25,
      citizenship: 'India',
      is_convicted_of_electoral_offense: true
    });
    expect(result.is_eligible).toBe(false);
    expect(result.reason).toContain('electoral offenses');
  });

  it('should report insufficient data if age or citizenship is missing', () => {
    const result = checkEligibility({
      is_of_sound_mind: true
    });
    expect(result.is_eligible).toBe(false);
    expect(result.reason).toContain('Insufficient data');
  });
});
