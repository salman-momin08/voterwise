import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { getFirebaseDb } from '../../lib/firebase';
import type { EPICWorkflow as EPICWorkflowType } from '../../types/civic';
import TrustIndicator from './TrustIndicator';
import './Civic.css';

interface EPICWorkflowProps {
  formType?: string;
}

const EPICWorkflow: React.FC<EPICWorkflowProps> = ({ formType = 'form_6' }) => {
  const [workflow, setWorkflow] = useState<EPICWorkflowType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflow = async () => {
      setLoading(true);
      const db = getFirebaseDb();
      const querySnapshot = await getDocs(collection(db, 'epic_workflows'));
      const found = querySnapshot.docs.find(doc => doc.id === formType);
      if (found) {
        setWorkflow(found.data() as EPICWorkflowType);
      }
      setLoading(false);
    };
    fetchWorkflow();
  }, [formType]);

  if (loading) return <div className="animate-pulse" style={{ height: '200px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}></div>;
  if (!workflow) return <div className="glass" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)' }}><AlertCircle size={24} /> Workflow not found.</div>;

  return (
    <div className="epic-workflow animate-fade-in">
      <div className="wizard-header" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2 className="section-title">{workflow.title}</h2>
        <p className="section-subtitle">{workflow.description}</p>
      </div>

      <div className="workflow-steps" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {workflow.steps.map((step, index) => (
          <div key={index} className="civic-action-card glass">
            <div className="action-card-header">
              <div className="action-icon-wrapper">
                <FileText size={20} />
              </div>
              <span className="step-badge" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                Step {step.step_number}
              </span>
            </div>
            
            <div className="action-card-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              
              {step.required_documents.length > 0 && (
                <div className="docs-list" style={{ marginTop: 'var(--space-md)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Required Documents:</span>
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: 'var(--space-xs)' }}>
                    {step.required_documents.map((doc, idx) => (
                      <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                        <CheckCircle2 size={12} color="var(--accent-secondary)" /> {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="action-card-footer">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Processing Time:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{step.estimated_processing_days} Days</span>
              </div>
              <a 
                href={step.portal_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary"
                style={{ padding: 'var(--space-sm) var(--space-lg)', fontSize: '0.85rem' }}
              >
                Go to Portal <ArrowRight size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-2xl)' }}>
        <TrustIndicator source={workflow.source} />
      </div>
    </div>
  );
};

export default EPICWorkflow;
