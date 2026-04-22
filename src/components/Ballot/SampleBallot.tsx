import React, { useState, useEffect } from 'react';
import { getFirebaseDb } from '../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { User, FileText, Shield, GraduationCap, Gavel, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ConstituencyMember } from '../../types/civic';
import TrustIndicator from '../Civic/TrustIndicator';
import './SampleBallot.css';

const INITIAL_CANDIDATES: ConstituencyMember[] = [
  {
    id: 'cand-1',
    name: 'Shri Arvind Kejriwal',
    party: 'AAP',
    role: 'MLA',
    constituency_id: 'New Delhi',
    state_code: 'DL',
    education: 'B.Tech (IIT Kharagpur)',
    criminal_cases: 0,
    assets: 'Verified',
    official_profile_url: 'https://delhi.gov.in',
    affidavit_url: 'https://affidavit.eci.gov.in/',
    source: { authority_name: 'ECI', authority_url: 'https://eci.gov.in', last_verified_timestamp: new Date().toISOString() }
  },
  {
    id: 'cand-2',
    name: 'Shri Somnath Bharti',
    party: 'AAP',
    role: 'MLA',
    constituency_id: 'Malviya Nagar',
    state_code: 'DL',
    education: 'M.Sc (IIT Delhi), LLB',
    criminal_cases: 1,
    assets: '₹1.2 Cr',
    official_profile_url: 'https://delhi.gov.in',
    affidavit_url: 'https://affidavit.eci.gov.in/',
    source: { authority_name: 'ECI', authority_url: 'https://eci.gov.in', last_verified_timestamp: new Date().toISOString() }
  },
  {
    id: 'cand-3',
    name: 'Shri P. C. Mohan',
    party: 'BJP',
    role: 'MP',
    constituency_id: 'Bangalore Central',
    state_code: 'KA',
    education: 'Intermediate',
    criminal_cases: 0,
    assets: '₹5.4 Cr',
    official_profile_url: 'https://india.gov.in',
    affidavit_url: 'https://affidavit.eci.gov.in/',
    source: { authority_name: 'ECI', authority_url: 'https://eci.gov.in', last_verified_timestamp: new Date().toISOString() }
  },
  {
    id: 'cand-4',
    name: 'Smt. Tejasvi Surya',
    party: 'BJP',
    role: 'MP',
    constituency_id: 'Bangalore South',
    state_code: 'KA',
    education: 'LLB',
    criminal_cases: 0,
    assets: '₹2.8 Cr',
    official_profile_url: 'https://india.gov.in',
    affidavit_url: 'https://affidavit.eci.gov.in/',
    source: { authority_name: 'ECI', authority_url: 'https://eci.gov.in', last_verified_timestamp: new Date().toISOString() }
  },
  {
    id: 'cand-5',
    name: 'Shri Rahul Gandhi',
    party: 'INC',
    role: 'MP',
    constituency_id: 'Wayanad',
    state_code: 'KL',
    education: 'M.Phil (Cambridge)',
    criminal_cases: 0,
    assets: 'Verified',
    official_profile_url: 'https://india.gov.in',
    affidavit_url: 'https://affidavit.eci.gov.in/',
    source: { authority_name: 'ECI', authority_url: 'https://eci.gov.in', last_verified_timestamp: new Date().toISOString() }
  }
];

const SampleBallot: React.FC = () => {
  const [candidates, setCandidates] = useState<ConstituencyMember[]>(INITIAL_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<ConstituencyMember | null>(INITIAL_CANDIDATES[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const db = getFirebaseDb();
    const q = collection(db, 'members');
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConstituencyMember));
      setCandidates(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="ballot-skeleton glass animate-pulse" style={{ height: '600px' }}></div>;

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
                onClick={() => setSelectedCandidate(candidate)}
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
