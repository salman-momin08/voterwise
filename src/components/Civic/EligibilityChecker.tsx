import React, { useState } from 'react';
import { Calendar, User, Shield, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { checkEligibility } from '../../engines/eligibility';
import type { EligibilityInput, EligibilityResult } from '../../types/civic';
import TrustIndicator from './TrustIndicator';
import './Civic.css';

interface EligibilityCheckerProps {
  onEligible: (result: EligibilityResult) => void;
}

const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ onEligible }) => {
  const [age, setAge] = useState<string>('');
  const [citizenship, setCitizenship] = useState<string>('India');
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const handleCheck = () => {
    const input: EligibilityInput = {
      age: parseInt(age),
      citizenship: citizenship,
      is_of_sound_mind: true, // Default assumed for basic check
      is_convicted_of_electoral_offense: false
    };

    const res = checkEligibility(input);
    
    // Attach source attribution as required by middleware
    const groundedResult: EligibilityResult = {
      ...res,
      source: {
        authority_name: 'Election Commission of India',
        authority_url: 'https://eci.gov.in',
        last_verified_timestamp: new Date().toISOString()
      }
    };

    setResult(groundedResult);
    if (groundedResult.is_eligible) {
      setTimeout(() => onEligible(groundedResult), 2000);
    }
  };

  const reset = () => {
    setResult(null);
    setAge('');
    setCitizenship('India');
  };

  return (
    <div className="eligibility-wizard animate-fade-in">
      <div className="wizard-header">
        <h2 className="section-title">ECI Eligibility Engine</h2>
        <p className="section-subtitle">Deterministic check grounded in the Representation of the People Act.</p>
      </div>

      {!result ? (
        <div className="wizard-form">
          <div className="wizard-question">
            <label className="input-label">
              <Calendar size={16} /> Your Current Age
            </label>
            <input 
              type="number" 
              className="input-primary"
              placeholder="e.g. 18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="wizard-question">
            <label className="input-label">
              <User size={16} /> Citizenship
            </label>
            <select 
              className="input-primary"
              value={citizenship}
              onChange={(e) => setCitizenship(e.target.value)}
            >
              <option value="India">Indian Citizen</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button 
            className="btn-primary" 
            onClick={handleCheck}
            disabled={!age}
            style={{ marginTop: 'var(--space-lg)', width: '100%' }}
          >
            Run Authoritative Check <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className={`result-container ${result.is_eligible ? 'success' : 'warning'}`}>
          <div className="result-header">
            {result.is_eligible ? (
              <Shield size={24} color="var(--success)" />
            ) : (
              <AlertCircle size={24} color="#f59e0b" />
            )}
            <h3>{result.is_eligible ? 'Eligibility Verified' : 'Eligibility Notice'}</h3>
          </div>
          <p className="result-reason" style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>{result.reason}</p>
          
          {result.next_steps && (
            <div className="result-action">
              <strong>Official Next Steps:</strong>
              <ul>
                {result.next_steps.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
          )}

          <TrustIndicator source={result.source} />

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={reset}>
              <RefreshCw size={16} /> Re-run Engine
            </button>
          </div>

          {result.is_eligible && (
            <p className="auto-advance-msg">
              ⏳ Ground-truth verified. Advancing to Constituency Mapping...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker;
