import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Info, 
  UserCheck,
  MapPin,
  ClipboardList,
  Search,
  ChevronRight
} from 'lucide-react';
import type { 
  WorkflowStepId, 
  WorkflowState
} from '../../types/civic';
import WorkflowProgress from './WorkflowProgress';
import EligibilityChecker from './EligibilityChecker';
import ConstituencyFinder from './ConstituencyFinder';
import EPICWorkflow from './EPICWorkflow';
import PollingLookup from './PollingLookup';
import ElectionScheduleView from './ElectionScheduleView';
import PollingChecklist from './PollingChecklist';
import './Civic.css';

const STEPS: WorkflowStepId[] = [
  'eligibility', 
  'constituency', 
  'registration_status', 
  'epic_registration', 
  'polling_lookup', 
  'election_schedule', 
  'polling_checklist'
];

const CivicNavigator: React.FC = () => {
  const [state, setState] = useState<WorkflowState>(() => {
    const saved = sessionStorage.getItem('voterwise_navigator_state');
    return saved ? JSON.parse(saved) : {
      current_step: 'eligibility' as WorkflowStepId,
      completed_steps: [] as WorkflowStepId[],
    };
  });

  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem('voterwise_navigator_state', JSON.stringify(state));
  }, [state]);

  const handleStepJump = (targetStep: WorkflowStepId) => {
    const targetIndex = STEPS.indexOf(targetStep);
    const currentIndex = STEPS.indexOf(state.current_step);
    
    // Allow jumping to any previously completed step or the very next step
    if (targetIndex <= currentIndex || state.completed_steps.includes(STEPS[targetIndex - 1])) {
      setState(prev => ({ ...prev, current_step: targetStep }));
      setWarning(null);
    } else {
      setWarning(`Please finish the ${STEPS[targetIndex - 1].toUpperCase()} section before moving to ${targetStep.toUpperCase()}.`);
      setTimeout(() => setWarning(null), 3000);
    }
  };

  const nextStep = (next: WorkflowStepId) => {
    setState(prev => ({
      ...prev,
      current_step: next,
      completed_steps: Array.from(new Set([...prev.completed_steps, prev.current_step]))
    }));
  };

  const prevStep = () => {
    const currentIndex = STEPS.indexOf(state.current_step);
    if (currentIndex > 0) {
      setState(prev => ({
        ...prev,
        current_step: STEPS[currentIndex - 1]
      }));
    }
  };

  const renderStep = () => {
    switch (state.current_step) {
      case 'eligibility':
        return (
          <EligibilityChecker 
            onEligible={(res) => {
              setState(prev => ({ ...prev, eligibility_result: res }));
              if (res.is_eligible) {
                setTimeout(() => nextStep('constituency'), 1500);
              }
            }} 
          />
        );
      
      case 'constituency':
        return (
          <ConstituencyFinder 
            onSelected={(ac) => {
              setState(prev => ({ ...prev, constituency: ac }));
              nextStep('registration_status');
            }} 
          />
        );

      case 'registration_status':
        return (
          <div className="step-container animate-fade-in">
            <div className="wizard-header">
              <h2 className="section-title">Registration Status</h2>
              <p className="section-subtitle">Are you already registered to vote in {state.constituency?.name}?</p>
            </div>
            
            <div className="option-group" style={{ marginTop: 'var(--space-xl)' }}>
              <div 
                className="option-card glass" 
                onClick={() => nextStep('polling_lookup')}
                style={{ padding: 'var(--space-2xl)' }}
              >
                <div className="action-icon-wrapper" style={{ margin: '0 auto var(--space-md)', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}>
                  <UserCheck size={24} />
                </div>
                <h3>Yes, I am registered</h3>
                <p style={{ fontSize: '0.85rem', marginTop: 'var(--space-sm)' }}>Save & Continue to booth lookup.</p>
              </div>
              
              <div 
                className="option-card glass" 
                onClick={() => nextStep('epic_registration')}
                style={{ padding: 'var(--space-2xl)' }}
              >
                <div className="action-icon-wrapper" style={{ margin: '0 auto var(--space-md)', background: 'rgba(255, 153, 51, 0.1)' }}>
                  <Search size={24} />
                </div>
                <h3>No, I need to register</h3>
                <p style={{ fontSize: '0.85rem', marginTop: 'var(--space-sm)' }}>Save & Continue to registration guide.</p>
              </div>
            </div>
          </div>
        );

      case 'epic_registration':
        return <EPICWorkflow formType="form_6" />;

      case 'polling_lookup':
        return (
          <PollingLookup 
            constituencyId={state.constituency?.id} 
            onNext={() => nextStep('election_schedule')}
          />
        );

      case 'election_schedule':
        return (
          <ElectionScheduleView 
            constituency={state.constituency} 
          />
        );

      case 'polling_checklist':
        return <PollingChecklist />;

      default:
        return (
          <div className="glass" style={{ padding: 'var(--space-2xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto var(--space-lg)' }} />
            <h2>Workflow Complete</h2>
            <p>You're all set for the upcoming elections. Check the timeline for polling dates.</p>
            <button 
              className="btn-primary" 
              onClick={() => {
                sessionStorage.removeItem('voterwise_navigator_state');
                setState({ current_step: 'eligibility', completed_steps: [] });
              }} 
              style={{ marginTop: 'var(--space-xl)' }}
            >
              Start New Journey
            </button>
          </div>
        );
    }
  };

  return (
    <div className="civic-navigator glass">
      <div className="navigator-header">
        <div className="header-top">
          <div className="navigator-title">
            <ClipboardList className="accent-icon" />
            <div>
              <h3>Civic Navigator</h3>
              <p>Your personalized journey to the ballot box.</p>
            </div>
          </div>
          <div className="google-badge">
            <Info size={12} /> Guided by ECI Rules
          </div>
        </div>
        
        <WorkflowProgress 
          currentStep={state.current_step} 
          completedSteps={state.completed_steps} 
          onStepClick={handleStepJump}
        />
      </div>

      {warning && (
        <div className="navigator-warning glass animate-fade-in">
          <Info size={14} />
          {warning}
        </div>
      )}

      <div className="navigator-content">
        {renderStep()}
      </div>

      <div className="navigator-footer">
        {state.current_step !== 'eligibility' && (
          <button className="btn-secondary" onClick={prevStep}>
            <ChevronLeft size={18} /> Back
          </button>
        )}

        {state.current_step === 'election_schedule' && (
          <button className="btn-primary" onClick={() => nextStep('polling_checklist')}>
            Save & Continue to Checklist <ChevronRight size={18} />
          </button>
        )}

        {state.current_step === 'polling_checklist' && (
          <button className="btn-primary" onClick={() => nextStep('status')}>
            Complete Journey <ChevronRight size={18} />
          </button>
        )}
        
        {state.constituency && (
          <div className="active-context">
            <MapPin size={14} />
            <span>{state.constituency.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CivicNavigator;
