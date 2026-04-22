import React, { useState } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import { getDirectionsUrl } from '../../engines/pollingStation';
import type { PollingStation } from '../../types/civic';
import TrustIndicator from './TrustIndicator';
import GoogleMap from './GoogleMap';
import './Civic.css';

interface PollingLookupProps {
  constituencyId?: string;
  onNext?: () => void;
}

const PollingLookup: React.FC<PollingLookupProps> = ({ constituencyId, onNext }) => {
  const [epicNumber, setEpicNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PollingStation | null>(null);

  const handleLookup = () => {
    setLoading(true);
    // Simulate lookup grounded in ECI sample data with real coordinates
    setTimeout(() => {
      setResult({
        id: 'ps_101',
        name: 'Government Primary School',
        address: 'Sector 4, RK Puram, New Delhi',
        constituency_id: constituencyId || 'ac_new_delhi',
        latitude: 28.5670, // RK Puram
        longitude: 77.1850,
        source: {
          authority_name: 'Election Commission of India',
          authority_url: 'https://voters.eci.gov.in',
          last_verified_timestamp: new Date().toISOString()
        }
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="polling-lookup animate-fade-in">
      <div className="wizard-header">
        <h2 className="section-title">Locate your Polling Station</h2>
        <p className="section-subtitle">Enter your EPIC number to find your designated polling booth with Map navigation.</p>
      </div>

      <div className="search-box">
        <input 
          type="text" 
          className="input-primary" 
          placeholder="Enter EPIC Number (e.g. ABC1234567)"
          value={epicNumber}
          onChange={(e) => setEpicNumber(e.target.value.toUpperCase())}
        />
        <button 
          className="btn-primary" 
          onClick={handleLookup}
          disabled={!epicNumber || loading}
        >
          {loading ? <Navigation className="spin" size={18} /> : <Search size={18} />}
          Locate
        </button>
      </div>

      {result && (
        <div className="result-card glass animate-fade-in" style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-lg)' }}>
            <div className="action-icon-wrapper" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}>
              <MapPin size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{result.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 'var(--space-xs) 0' }}>{result.address}</p>
            </div>
          </div>

          {result.latitude && result.longitude && (
            <GoogleMap lat={result.latitude} lng={result.longitude} title={result.name} />
          )}

          <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <a 
              href={getDirectionsUrl(result)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
              style={{ flex: 1, minWidth: '150px' }}
            >
              Start Navigation <Navigation size={18} />
            </a>
            {onNext && (
              <button 
                onClick={onNext}
                className="btn-primary"
                style={{ flex: 1, minWidth: '150px', background: 'var(--accent-secondary)' }}
              >
                Proceed to Schedule <Navigation size={18} style={{ transform: 'rotate(90deg)' }} />
              </button>
            )}
          </div>

          <TrustIndicator source={result.source} />
        </div>
      )}
    </div>
  );
};

export default PollingLookup;
