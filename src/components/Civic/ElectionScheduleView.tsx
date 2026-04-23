import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Info, CheckCircle2, ExternalLink } from 'lucide-react';
import { getFirebaseDb } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Election, AssemblyConstituency } from '../../types/civic';
import { detectElectionLifecycle } from '../../engines/lifecycle';
import TrustIndicator from './TrustIndicator';
import './Civic.css';

interface ElectionScheduleViewProps {
  constituency?: AssemblyConstituency;
}

const ElectionScheduleView: React.FC<ElectionScheduleViewProps> = ({ constituency }) => {
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      // In production, we query the election that includes this constituency
      // For now, we fetch the latest general election
      const db = getFirebaseDb();
      const q = query(collection(db, 'elections'), where('is_active', '==', true));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setElection(snapshot.docs[0].data() as Election);
      }
      setLoading(false);
    };
    fetchSchedule();
  }, [constituency]);

  if (loading) return <div className="loading-spinner">Synchronizing ECI Dates...</div>;

  const status = election ? detectElectionLifecycle(election) : 'SCHEDULE_AWAITED';

  return (
    <div className="step-container animate-fade-in">
      <div className="wizard-header">
        <h2 className="section-title">Election Schedule</h2>
        <p className="section-subtitle">Grounded in official ECI Gazetted dates for your region.</p>
      </div>

      {!election ? (
        <div className="timeline-empty-state glass animate-fade-in" style={{ marginTop: 'var(--space-xl)' }}>
          <div className="empty-icon-wrapper">
            <Calendar size={48} className="empty-icon" />
            <div className="pulse-ring"></div>
          </div>
          <h3>Official Schedule Awaited</h3>
          <p>The Election Commission of India (ECI) has not yet released the phase-wise schedule for {constituency?.name || 'this region'}. VoterWise is monitoring authoritative streams for the 2026 notification.</p>
          
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="btn-official-eci">
            Visit ECI Newsroom <ExternalLink size={14} />
          </a>
        </div>
      ) : (
        <div className="schedule-card glass animate-fade-in">
          <div className="card-top">
            <div className="election-info">
              <h3>{election.title}</h3>
              <span className="status-badge active">{status.replace(/_/g, ' ')}</span>
            </div>
          </div>

          <div className="schedule-grid">
            <div className="schedule-item">
              <div className="action-icon-wrapper" style={{ width: '36px', height: '36px', background: 'rgba(255, 153, 51, 0.1)' }}>
                <Calendar size={18} />
              </div>
              <div>
                <label>Polling Date</label>
                <span>{election.phases?.[0] ? new Date(election.phases[0].polling_date).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'Date Awaited'}</span>
              </div>
            </div>

            <div className="schedule-item">
              <div className="action-icon-wrapper" style={{ width: '36px', height: '36px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <Clock size={18} />
              </div>
              <div>
                <label>Voting Hours</label>
                <span>7:00 AM - 6:00 PM</span>
              </div>
            </div>

            <div className="schedule-item">
              <div className="action-icon-wrapper" style={{ width: '36px', height: '36px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <MapPin size={18} />
              </div>
              <div>
                <label>Your Region</label>
                <span>{constituency?.name || 'Constituency Mapping Active'}</span>
              </div>
            </div>
          </div>

          <div className="phase-indicator">
            <div className="phase-steps">
              <div className="p-step completed"><CheckCircle2 size={14} /> Notification</div>
              <div className="p-step active">Nomination</div>
              <div className="p-step">Polling</div>
              <div className="p-step">Results</div>
            </div>
          </div>

          <TrustIndicator source={election.source} />
        </div>
      )}

      <div className="guidance-card glass info" style={{ marginTop: 'var(--space-xl)' }}>
        <Info size={20} className="guidance-icon" />
        <div className="guidance-content">
          <h4>Voter Readiness</h4>
          <p>Ensure you have your EPIC card and are listed in the current Electoral Roll before the polling date. Visit the official ECI portal for registration verification.</p>
        </div>
      </div>
    </div>
  );
};

export default ElectionScheduleView;
