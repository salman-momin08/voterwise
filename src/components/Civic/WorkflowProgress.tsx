import React from 'react';
import { Check } from 'lucide-react';
import type { WorkflowStepId } from '../../types/civic';
import './Civic.css';

interface Step {
  id: WorkflowStepId;
  label: string;
}

interface WorkflowProgressProps {
  currentStep: WorkflowStepId;
  completedSteps: WorkflowStepId[];
  onStepClick: (stepId: WorkflowStepId) => void;
}

const STEPS: Step[] = [
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'constituency', label: 'Region' },
  { id: 'registration_status', label: 'Status' },
  { id: 'epic_registration', label: 'Register' },
  { id: 'polling_lookup', label: 'Polling' },
  { id: 'election_schedule', label: 'Schedule' },
  { id: 'polling_checklist', label: 'Checklist' },
];

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ currentStep, completedSteps, onStepClick }) => {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="workflow-progress">
      {STEPS.map((step, index) => {
        // A step is "visited" if it's in the completedSteps array OR if it's before the current step
        const isVisited = completedSteps.includes(step.id) || index < currentIndex;
        const isActive = currentStep === step.id;
        
        return (
          <div 
            key={step.id} 
            className={`progress-step ${isActive ? 'active' : ''} ${isVisited ? 'completed' : ''}`}
            onClick={() => { onStepClick(step.id); }}
            style={{ cursor: 'pointer' }}
          >
            <div className="step-dot">
              {isVisited ? <Check size={16} /> : index + 1}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowProgress;
