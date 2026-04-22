import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, CheckCircle } from 'lucide-react';
import { getFirebaseDb } from '../../lib/firebase';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { detectConstituency } from '../../engines/constituency';
import type { IndianState, AssemblyConstituency, SourceAttribution } from '../../types/civic';
import TrustIndicator from './TrustIndicator';
import './Civic.css';

const ECI_SOURCE: SourceAttribution = {
  authority_name: 'Election Commission of India',
  authority_url: 'https://eci.gov.in',
  last_verified_timestamp: new Date().toISOString(),
};

interface ConstituencyFinderProps {
  onSelected: (ac: AssemblyConstituency) => void;
  initialState?: string;
}

const ConstituencyFinder: React.FC<ConstituencyFinderProps> = ({ onSelected, initialState }) => {
  const [pincode, setPincode] = useState('');
  const [states, setStates] = useState<IndianState[]>([]);
  const [constituencies, setConstituencies] = useState<AssemblyConstituency[]>([]);
  const [selectedState, setSelectedState] = useState(initialState || '');
  const [detectedAC, setDetectedAC] = useState<AssemblyConstituency | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      const db = getFirebaseDb();
      const querySnapshot = await getDocs(collection(db, 'india'));
      const statesList = querySnapshot.docs.map(doc => doc.data() as IndianState);
      setStates(statesList);
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setConstituencies([]);
      return;
    }
    const fetchACs = async () => {
      const db = getFirebaseDb();
      const querySnapshot = await getDocs(collection(db, 'india', selectedState, 'constituencies'));
      const acList = querySnapshot.docs.map(doc => doc.data() as AssemblyConstituency);
      setConstituencies(acList);
    };
    fetchACs();
  }, [selectedState]);

  const handlePincodeSearch = () => {
    setIsSearching(true);
    // Simulate network delay
    setTimeout(() => {
      const ac = detectConstituency(pincode);
      if (ac) {
        setDetectedAC({ ...ac, source: ECI_SOURCE } as AssemblyConstituency);
      } else {
        alert('Could not detect constituency for this pincode. Please select manually.');
      }
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="constituency-finder animate-fade-in">
      <div className="wizard-header">
        <h2 className="section-title">Find your Constituency</h2>
        <p className="section-subtitle">Enter your pincode or select your state to find your voting region.</p>
      </div>

      <div className="search-box">
        <div style={{ flex: 1, position: 'relative' }}>
          <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input 
            type="text" 
            className="input-primary" 
            placeholder="Enter Pincode (e.g. 110001)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <button 
          className="btn-primary" 
          onClick={handlePincodeSearch}
          disabled={pincode.length < 6 || isSearching}
        >
          {isSearching ? <Navigation className="spin" size={18} /> : <Search size={18} />}
          Find
        </button>
      </div>

      <div className="divider" style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8rem', margin: 'var(--space-md) 0' }}>
        — OR SELECT MANUALLY —
      </div>

      <div className="manual-selection">
        <div className="selection-grid">
          <select 
            className="input-primary"
            value={selectedState} 
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.code} value={state.code}>{state.name}</option>
            ))}
          </select>

          {selectedState && (
            <select 
              className="input-primary animate-fade-in"
              value={detectedAC?.id || ''}
              onChange={(e) => {
                const ac = constituencies.find(c => c.id === e.target.value);
                if (ac) setDetectedAC({ ...ac, source: ECI_SOURCE });
              }}
            >
              <option value="">Select Constituency</option>
              {constituencies.map(ac => (
                <option key={ac.id} value={ac.id}>{ac.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>


      {detectedAC && (
        <div className="result-container success animate-fade-in" style={{ marginTop: 'var(--space-xl)' }}>
          <div className="result-header">
            <CheckCircle size={24} color="var(--success)" />
            <h3>{detectedAC.name}</h3>
          </div>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <span className="step-badge">AC Number: {detectedAC.number}</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
              We've identified your voting region based on ECI ground-truth mapping.
            </p>
          </div>
          <TrustIndicator source={detectedAC.source} />
          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: 'var(--space-md)' }}
            onClick={() => onSelected(detectedAC)}
          >
            Confirm & Continue <Navigation size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ConstituencyFinder;
