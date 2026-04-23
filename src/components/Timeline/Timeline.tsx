import React, { useState, useEffect } from 'react';
import { getFirebaseDb } from '../../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Calendar, MapPin, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import './Timeline.css';

interface ElectionStep {
  id: string;
  task: string;
  date: string;
  description: string;
  type: 'deadline' | 'event' | 'action';
  isCritical: boolean;
}

interface TimelineProps {
  onStateChange?: (state: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ onStateChange }) => {
  const [steps, setSteps] = useState<ElectionStep[]>([]);
  const [selectedState, setSelectedState] = useState('Delhi');
  const [loading, setLoading] = useState(true);

  // Indian States/UTs
  const states = ['Delhi', 'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu', 'West Bengal'];

  useEffect(() => {
    let isMounted = true;
    const fetchLocalizedData = async () => {
      setLoading(true);
      try {
        const db = getFirebaseDb();
        const q = query(
          collection(db, 'elections'),
          orderBy('year', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedSteps: ElectionStep[] = [];
        querySnapshot.forEach((doc) => {
          fetchedSteps.push({ id: doc.id, ...doc.data() } as ElectionStep);
        });

        if (isMounted) {
          if (fetchedSteps.length === 0) {
            setSteps(getIndianElectionData(selectedState));
          } else {
            setSteps(fetchedSteps);
          }
        }
      } catch (error) {
        console.error("Error fetching timeline:", error);
        if (isMounted) setSteps(getIndianElectionData(selectedState));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchLocalizedData();
    return () => { isMounted = false; };
  }, [selectedState]);

  return (
    <section className="timeline-section" id="roadmap" aria-labelledby="timeline-heading">
      <div className="timeline-header">
        <h2 id="timeline-heading">Indian Election Roadmap 2026</h2>
        <div className="location-selector glass">
          <MapPin size={18} />
          <select 
            value={selectedState} 
            onChange={(e) => {
              const newState = e.target.value;
              setSelectedState(newState);
              if (onStateChange) onStateChange(newState);
            }}
            aria-label="Select your State/UT for localized deadlines"
          >
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="timeline-container">
        {loading ? (
          <div className="timeline-skeleton">
            <div className="shimmer" style={{ height: '120px', borderRadius: '12px', marginBottom: '1rem' }}></div>
            <div className="shimmer" style={{ height: '120px', borderRadius: '12px' }}></div>
          </div>
        ) : (
          <div className="timeline-grid">
            {steps.length > 0 ? (
              steps.map((step, index) => (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`timeline-item glass ${step.isCritical ? 'critical' : ''}`}
                >
                  <div className="timeline-marker">
                    <div className="marker-line"></div>
                    <div className="marker-dot">
                      <Calendar size={14} />
                    </div>
                  </div>
                  
                  <div className="timeline-content">
                    <div className="step-date">
                      <Clock size={14} />
                      {new Date(step.date).toLocaleDateString('en-IN', { 
                        day: 'numeric',
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                    <h3>{step.task}</h3>
                    <p>{step.description}</p>
                    
                    {step.isCritical && (
                      <div className="critical-badge">
                        <AlertCircle size={14} />
                        ECI Mandatory Deadline
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="timeline-empty-state glass animate-fade-in">
                <div className="empty-icon-wrapper">
                  <Clock size={48} className="empty-icon" />
                  <div className="pulse-ring"></div>
                </div>
                <h3>Official Schedule Awaited</h3>
                <p>The Election Commission of India (ECI) has not yet released the phase-wise schedule for this region. VoterWise is monitoring authoritative streams for the 2026 notification.</p>
                
                <div className="pre-election-guidance">
                  <h4>What you can do now:</h4>
                  <div className="guidance-grid">
                    <div className="guidance-card">
                      <div className="dot green"></div>
                      <span>Verify your name in the Voter List (Form 6)</span>
                    </div>
                    <div className="guidance-card">
                      <div className="dot orange"></div>
                      <span>Check for booth-level officer (BLO) updates</span>
                    </div>
                  </div>
                </div>

                <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer" className="btn-official-eci">
                  Visit Official ECI Portal <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const getIndianElectionData = (state: string): ElectionStep[] => [
  {
    id: 'in-1',
    task: 'Gazette Notification Issued',
    date: '2026-04-10',
    description: `Official ECI notification for the commencement of elections in ${state}.`,
    type: 'event',
    isCritical: false
  },
  {
    id: 'in-2',
    task: 'Last Date for Nominations',
    date: '2026-04-17',
    description: `Final day for candidates to file nomination papers in their respective constituencies.`,
    type: 'deadline',
    isCritical: true
  },
  {
    id: 'in-3',
    task: 'Scrutiny of Nominations',
    date: '2026-04-18',
    description: 'ECI officials review all filed nominations for eligibility and correctness.',
    type: 'event',
    isCritical: false
  },
  {
    id: 'in-4',
    task: 'Polling Day',
    date: '2026-05-13',
    description: `Go to your designated polling station in ${state} to cast your vote. Don't forget your EPIC card!`,
    type: 'action',
    isCritical: true
  }
];

export default Timeline;
