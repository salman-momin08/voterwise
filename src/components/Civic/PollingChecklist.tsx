import React from 'react';
import { CheckCircle2, ShieldCheck, AlertTriangle, Fingerprint, Smartphone, Info } from 'lucide-react';
import './Civic.css';

const CHECKLIST_ITEMS = [
  {
    id: 'id-proof',
    icon: <ShieldCheck size={20} />,
    title: 'Valid ID Proof',
    desc: 'EPIC (Voter ID) or 12 alternative documents (Aadhaar, Passport, etc.) as approved by ECI.',
    required: true
  },
  {
    id: 'slip',
    icon: <CheckCircle2 size={20} />,
    title: 'Voter Information Slip',
    desc: 'Helps in locating your serial number in the electoral roll quickly.',
    required: false
  },
  {
    id: 'queue',
    icon: <Fingerprint size={20} />,
    title: 'Marking & Inking',
    desc: 'Expect indelible ink marking on your left forefinger before voting.',
    required: true
  },
  {
    id: 'prohibited',
    icon: <Smartphone size={20} />,
    title: 'Mobile Phones',
    desc: 'Mobile phones and electronic gadgets are strictly prohibited inside the polling booth.',
    required: true,
    is_warning: true
  }
];

const PollingChecklist: React.FC = () => {
  return (
    <div className="step-container animate-fade-in">
      <div className="wizard-header">
        <h2 className="section-title">Polling Day Checklist</h2>
        <p className="section-subtitle">Final preparation for your visit to the booth.</p>
      </div>

      <div className="checklist-grid">
        {CHECKLIST_ITEMS.map((item) => (
          <div key={item.id} className={`checklist-card glass ${item.is_warning ? 'warning-card' : ''}`}>
            <div className="checklist-icon">
              {item.icon}
            </div>
            <div className="checklist-content">
              <div className="checklist-title">
                {item.title}
                {item.required && <span className="req-badge">Mandatory</span>}
              </div>
              <p className="checklist-desc">{item.desc}</p>
            </div>
          </div>
        ))}
        
        {/* Harmonized Guidance Cards */}
        <div className="checklist-card glass warning-card">
          <div className="checklist-icon" style={{ color: '#f59e0b' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="checklist-content">
            <div className="checklist-title">Model Code of Conduct</div>
            <p className="checklist-desc">Maintain silence and follow the Presiding Officer's instructions at all times.</p>
          </div>
        </div>

        <div className="checklist-card glass info-card">
          <div className="checklist-icon" style={{ color: '#3b82f6' }}>
            <Info size={20} />
          </div>
          <div className="checklist-content">
            <div className="checklist-title">Booth Level Support</div>
            <p className="checklist-desc">Contact the Booth Level Officer (BLO) immediately for any authoritative assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollingChecklist;
