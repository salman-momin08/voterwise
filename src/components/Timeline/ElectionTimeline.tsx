import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getFirebaseDb } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Election, SourceAttribution } from '../../types/civic';
import { detectElectionLifecycle } from '../../engines/lifecycle';
import TrustIndicator from '../Civic/TrustIndicator';
import './Timeline.css';

const ElectionTimeline: React.FC = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirebaseDb();
    const q = query(collection(db, 'schedule'), orderBy('date', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => {
        const data = doc.data();
        const rawPhases = (data.phases as Array<Record<string, unknown>>) ?? [];
        
        return {
          id: doc.id,
          title: String(data.title ?? ''),
          type: (data.type ?? 'general') as 'general' | 'assembly' | 'bye-election',
          year: Number(data.year ?? 0),
          results_declared: Boolean(data.results_declared ?? false),
          source: data.source as SourceAttribution,
          phases: rawPhases.map(p => ({
            id: String(p.id ?? ''),
            phase_number: Number(p.phase_number ?? 0),
            states: (p.states as string[] ?? []),
            constituencies: (p.constituencies as string[] ?? []),
            nomination_start: String(p.nomination_start ?? ''),
            nomination_end: String(p.nomination_end ?? ''),
            scrutiny_date: String(p.scrutiny_date ?? ''),
            withdrawal_date: String(p.withdrawal_date ?? ''),
            polling_date: String(p.polling_date ?? ''),
            counting_date: String(p.counting_date ?? ''),
            source: p.source as SourceAttribution
          }))
        } as Election;
      });
      setElections(list);
      setLoading(false);
    });

    return () => { unsubscribe(); };
  }, []);

  if (loading) return <div className="timeline-skeleton animate-pulse glass" style={{ height: '400px', borderRadius: 'var(--radius-xl)' }}></div>;

  // Find most relevant election (active or upcoming)
  const activeElection = elections[0] || null;
  const status = detectElectionLifecycle(activeElection);

  return (
    <div className="election-timeline animate-fade-in">
      {status === 'schedule_not_announced' ? (
        <div className="timeline-empty-state glass animate-fade-in" style={{ border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className="empty-icon-wrapper">
            <Clock size={48} className="empty-icon" />
            <div className="pulse-ring"></div>
          </div>
          <h3>Schedule Not Yet Announced</h3>
          <p>The Election Commission of India has not yet released the official notification for this election cycle. VoterWise is monitoring authoritative streams for the 2026 update.</p>
          <div className="verified-badge" style={{ marginTop: 'var(--space-md)', fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
            Monitoring ECI Newsroom (Ground Truth)
          </div>
        </div>
      ) : (
        <div className="election-card glass animate-fade-in">
          <div className="timeline-header">
            <div className="status-badge-container">
              <span className={`status-badge ${status}`}>
                {status.replace(/_/g, ' ')}
              </span>
            </div>
            <h3>{activeElection.title || 'General Election Roadmap'}</h3>
          </div>

          <div className="timeline-items">
            {activeElection.phases?.map((phase, idx) => (
              <div key={phase.id} className="timeline-item">
                <div className="item-marker">
                  <div className="marker-dot"></div>
                  {idx < (activeElection.phases?.length ?? 0) - 1 && <div className="marker-line"></div>}
                </div>
                <div className="item-content">
                  <div className="item-date">Phase {phase.phase_number} • {new Date(phase.polling_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div className="item-title">Polling Day</div>
                  <div className="item-desc">
                    Scheduled for {phase.states.join(', ')}. Results to be announced on {new Date(phase.counting_date).toLocaleDateString('en-IN')}.
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeElection && (
            <div className="timeline-footer" style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <TrustIndicator source={activeElection.source} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ElectionTimeline;
