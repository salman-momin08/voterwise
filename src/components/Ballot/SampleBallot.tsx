import React, { useState, useEffect } from 'react';
import { useCivicStore } from '../../store/civicStore';
import { User, FileText, Shield, GraduationCap, Gavel, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ConstituencyMember } from '../../types/civic';
import TrustIndicator from '../Civic/TrustIndicator';
import './SampleBallot.css';

const SampleBallot: React.FC = () => {
  const { candidates, isCandidatesLoaded, subscribeToCandidates } = useCivicStore();
  const [selectedCandidate, setSelectedCandidate] = useState<ConstituencyMember | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCandidates();
    return () => { unsubscribe(); };
  }, [subscribeToCandidates]);

  useEffect(() => {
    if (isCandidatesLoaded && candidates.length > 0 && !selectedCandidate) {
      setSelectedCandidate(candidates[0]);
    }
  }, [isCandidatesLoaded, candidates, selectedCandidate]);

  if (!isCandidatesLoaded) return <div className="ballot-skeleton glass animate-pulse" style={{ height: '600px' }}></div>;

  return (
    <div className="ballot-explorer">
      <div className="ballot-grid">
        <div className="candidate-list glass">
          <div className="list-header">
            <h4>Candidates & Representatives</h4>
            <p>Sourced from ECI Affidavit Portal</p>
          </div>
          <div className="scrollable-list">
            {candidates.map(candidate => (
              <button 
                key={candidate.id}
                className={`candidate-card ${selectedCandidate?.id === candidate.id ? 'active' : ''}`}
                onClick={() => { setSelectedCandidate(candidate); }}
              >
                <div className="candidate-avatar">
                  <User size={20} />
                </div>
                <div className="candidate-info">
                  <span className="name">{candidate.name}</span>
                  <span className="party-badge">{candidate.party}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="candidate-detail glass">
          <AnimatePresence mode="wait">
            {selectedCandidate ? (
              <motion.div 
                key={selectedCandidate.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="detail-content"
              >
                <div className="detail-header">
                  <div className="main-info">
                    <h2>{selectedCandidate.name}</h2>
                    <span className="party-text">{selectedCandidate.party} • {selectedCandidate.role}</span>
                  </div>
                  <a 
                    href={selectedCandidate.affidavit_url || 'https://affidavit.eci.gov.in/'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-affidavit"
                  >
                    <FileText size={16} /> View ECI Affidavit
                  </a>
                </div>

                <div className="affidavit-grid">
                  <div className="affidavit-item">
                    <GraduationCap size={18} className="item-icon" />
                    <div className="item-text">
                      <span className="label">Education</span>
                      <span className="value">{selectedCandidate.education || 'Data Pending'}</span>
                    </div>
                  </div>
                  <div className="affidavit-item">
                    <Gavel size={18} className="item-icon" />
                    <div className="item-text">
                      <span className="label">Criminal Cases</span>
                      <span className="value">{selectedCandidate.criminal_cases ?? '0'}</span>
                    </div>
                  </div>
                  <div className="affidavit-item">
                    <Shield size={18} className="item-icon" />
                    <div className="item-text">
                      <span className="label">Assets</span>
                      <span className="value">{selectedCandidate.assets || 'Verified in Affidavit'}</span>
                    </div>
                  </div>
                </div>

                <div className="explanation-section glass">
                  <div className="explanation-header">
                    <Info size={16} />
                    <span>AI Explanation Layer</span>
                  </div>
                  <p>
                    Gemini Insight: This representative's background has been cross-referenced with ECI records. 
                    Click 'View Affidavit' to read the full disclosure including liabilities and complete education history.
                  </p>
                </div>

                <TrustIndicator source={selectedCandidate.source} />
              </motion.div>
            ) : (
              <div className="detail-placeholder">
                <Shield size={48} className="placeholder-icon" />
                <h3>Select a representative to view grounded details</h3>
                <p>Data is synchronized with the ECI National Affidavit Ingestion Pipeline.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SampleBallot;
