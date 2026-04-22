/**
 * Deterministic Eligibility Engine (India)
 * 
 * Rules derived from:
 * - Representation of the People Act, 1950 & 1951
 * - Election Commission of India (ECI) Voter Eligibility Handbook
 * 
 * Gemini must NOT determine eligibility. This engine is the sole authority.
 */

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
}

export const checkEligibility = (input: EligibilityInput): EligibilityResult => {
  // 1. Citizenship Check (Strict)
  if (input.citizenship && input.citizenship.toLowerCase() !== 'india' && input.citizenship.toLowerCase() !== 'indian') {
    return {
      is_eligible: false,
      reason: 'Only Indian citizens are eligible to register as voters in India.',
      next_steps: ['Overseas citizens may refer to Form 6A for specific NRI registration guidelines.']
    };
  }

  // 2. Age Check (18+ by the qualifying date)
  if (input.age !== undefined && input.age < 18) {
    return {
      is_eligible: false,
      reason: `You must be at least 18 years old. Currently, you are ${input.age}.`,
      next_steps: [`Wait until you reach 18. You can pre-apply if you are 17+ for the next qualifying date.`]
    };
  }

  // 3. Legal Disqualifications
  if (input.is_of_sound_mind === false) {
    return {
      is_eligible: false,
      reason: 'Persons declared of unsound mind by a competent court are disqualified from registration.',
    };
  }

  if (input.is_convicted_of_electoral_offense === true) {
    return {
      is_eligible: false,
      reason: 'Certain convictions for electoral offenses or corrupt practices may lead to temporary disqualification.',
    };
  }

  // 4. Fallback for incomplete data
  if (input.age === undefined || !input.citizenship) {
    return {
      is_eligible: false,
      reason: 'Insufficient data to determine eligibility.',
      next_steps: ['Please provide your age and citizenship status.']
    };
  }

  return {
    is_eligible: true,
    reason: 'You meet the primary criteria for voter registration in India.',
    next_steps: ['Proceed to Form 6 submission for new voter registration.'],
    form_type: 'form_6'
  };
};
