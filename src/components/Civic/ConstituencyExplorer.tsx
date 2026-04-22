import React, { useState, useEffect } from 'react';
import { getFirebaseDb } from '../../lib/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { MapPin, Users, Globe, Building2, Search, ExternalLink, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IndianState, District, ConstituencyMember } from '../../types/civic';
import TrustIndicator from './TrustIndicator';
import './ConstituencyExplorer.css';

const ConstituencyExplorer: React.FC = () => {
  const [states, setStates] = useState<IndianState[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [members, setMembers] = useState<ConstituencyMember[]>([]);
  
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch all states on mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      const db = getFirebaseDb();
      const snapshot = await getDocs(collection(db, 'india'));
      const data = snapshot.docs.map(doc => doc.data() as IndianState);
      setStates(data);
      setLoading(false);
    };
    fetchStates();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      return;
    }
    const fetchDistricts = async () => {
      const db = getFirebaseDb();
      const snapshot = await getDocs(collection(db, 'india', selectedState, 'districts'));
      const data = snapshot.docs.map(doc => doc.data() as District);
      setDistricts(data);
    };
    fetchDistricts();
  }, [selectedState]);

  // Fetch members when state changes (Real-time)
  useEffect(() => {
    if (!selectedState) {
      setMembers([]);
      return;
    }
    const db = getFirebaseDb();
    const q = collection(db, 'members');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMembers = snapshot.docs.map(doc => doc.data() as ConstituencyMember);
      const filtered = allMembers.filter(m => m.state_code === selectedState);
      setMembers(filtered);
    });

    return () => unsubscribe();
  }, [selectedState]);

  const refreshData = () => {
    setLoading(true);
    // Trigger re-fetches by resetting state
    setSelectedState('');
    setSelectedDistrict('');
    const fetchStates = async () => {
      const db = getFirebaseDb();
      const snapshot = await getDocs(collection(db, 'india'));
      setStates(snapshot.docs.map(doc => doc.data() as IndianState));
      setLoading(false);
    };
    fetchStates();
  };

  return (
    <div className="explorer-container animate-fade-in">
      <div className="explorer-actions">
        <button className="btn-secondary" onClick={refreshData} disabled={loading}>
          {loading ? <div className="spinner-mini" /> : <Search size={16} />}
          {loading ? 'Syncing...' : 'Re-Sync Data'}
        </button>
      </div>

      <div className="explorer-selectors">
        <div className="select-box">
          <label><Globe size={14} /> Select State</label>
          <select 
            value={selectedState} 
            onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
          >
            <option value="">Choose a State...</option>
            {states.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
        </div>

        <div className="select-box">
          <label><Building2 size={14} /> Select District / City</label>
          <select 
            value={selectedDistrict} 
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">All Districts</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedState ? (
          <motion.div 
            key={selectedState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="explorer-results"
          >
            <section className="results-section">
              <div className="section-title">
                <Users size={18} />
                <h3>Elected Representatives ({selectedState})</h3>
              </div>
              <div className="members-grid">
                {members.length > 0 ? (
                  members.map(member => (
                    <div key={member.id} className="member-card glass">
                      <div className="member-info">
                        <div className="member-role-badge">{member.role}</div>
                        <h4>{member.name}</h4>
                        <p className="member-party">{member.party}</p>
                        <p className="member-const">Constituency: {member.constituency_id}</p>
                      </div>
                      <a href={member.official_profile_url} target="_blank" rel="noopener noreferrer" className="profile-link">
                        Official Profile <ExternalLink size={12} />
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="empty-msg">No members data available for this selection yet.</p>
                )}
              </div>
            </section>

            <section className="results-section">
              <div className="section-title">
                <MapPin size={18} />
                <h3>Featured Jurisdictions</h3>
              </div>
              <div className="districts-list">
                {districts
                  .filter(d => !selectedDistrict || d.id === selectedDistrict)
                  .map(d => (
                  <div key={d.id} className="district-chip glass">
                    <Building2 size={14} />
                    <span>{d.name}</span>
                    <ChevronRight size={14} className="arrow" />
                  </div>
                ))}
              </div>
            </section>

            <div className="explorer-footer">
              <TrustIndicator source={states.find(s => s.code === selectedState)?.source || { authority_name: 'ECI', authority_url: 'https://eci.gov.in', last_verified_timestamp: '' }} />
            </div>
          </motion.div>
        ) : (
          <div className="explorer-placeholder">
            <Search size={48} className="placeholder-icon" />
            <h3>Select a state to explore its civic structure</h3>
            <p>View cities, districts, and the members representing them in the 2026 cycle.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConstituencyExplorer;
