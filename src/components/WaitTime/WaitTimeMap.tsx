import React, { useState, useEffect } from 'react';
import { getFirebaseDb, getFirebaseAuth } from '../../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Clock, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import './WaitTimeMap.css';

interface WaitTimeReport {
  id: string;
  constituency: string;
  timeRange: string;
  timestamp: Timestamp | null;
  userId: string;
}

type StateData = Record<string, string[]>;
type LocationStructure = Record<string, StateData>;

const LOCATION_DATA: LocationStructure = {
  'Delhi': {
    'New Delhi': ['Connaught Place', 'Chanakyapuri', 'Delhi Cantt'],
    'South Delhi': ['Saket', 'Hauz Khas', 'Mehrauli'],
    'North Delhi': ['Model Town', 'Alipur', 'Narela']
  },
  'Maharashtra': {
    'Mumbai City': ['Colaba', 'Byculla', 'Malabar Hill'],
    'Mumbai Suburban': ['Andheri', 'Bandra', 'Borivali'],
    'Pune': ['Haveli', 'Shirur', 'Ambegaon']
  },
  'Karnataka': {
    'Bangalore Urban': ['Bangalore North', 'Bangalore South', 'Bangalore East'],
    'Mysore': ['Mysore', 'Hunsur', 'Nanjangud'],
    'Belgaum': ['Belgaum', 'Chikkodi', 'Athani']
  }
};

const WaitTimeMap: React.FC = () => {
  const [reports, setReports] = useState<WaitTimeReport[]>([]);
  const [selectedState, setSelectedState] = useState<keyof typeof LOCATION_DATA>('Delhi');
  const [selectedDistrict, setSelectedDistrict] = useState('New Delhi');
  const [selectedTaluk, setSelectedTaluk] = useState('Connaught Place');
  const [isReporting, setIsReporting] = useState(false);
  const [lastReported, setLastReported] = useState<number | null>(null);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  const states = Object.keys(LOCATION_DATA);
  const districts = Object.keys(LOCATION_DATA[selectedState]);
  const taluks = LOCATION_DATA[selectedState][selectedDistrict] || [];

  useEffect(() => {
    if (!lastReported) return;
    
    const checkCooldown = () => {
      const active = Date.now() - lastReported < 300000;
      setIsCooldownActive(active);
      return active;
    };

    if (checkCooldown()) {
      const timer = setInterval(checkCooldown, 10000);
      return () => { clearInterval(timer); };
    }
  }, [lastReported]);

  useEffect(() => {
    const db = getFirebaseDb();

    const q = query(
      collection(db, 'wait-times-india'),
      where('constituency', '==', selectedTaluk),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const rawData = doc.data();
        return {
          id: doc.id,
          constituency: String(rawData.constituency ?? ''),
          timeRange: String(rawData.timeRange ?? ''),
          timestamp: rawData.timestamp as Timestamp | null,
          userId: String(rawData.userId ?? ''),
        };
      });
      setReports(data);
    });

    return () => { unsubscribe(); };
  }, [selectedTaluk]);

  const submitReport = async (range: string) => {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) {
      alert("Please join the community to report live wait times.");
      return;
    }

    try {
      const db = getFirebaseDb();
      
      await addDoc(collection(db, 'wait-times-india'), {
        constituency: selectedTaluk,
        district: selectedDistrict,
        state: selectedState,
        timeRange: range,
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp()
      });
      const now = Date.now();
      setLastReported(now);
      setIsReporting(false);
    } catch (error) {
      console.error("Report failed:", error);
    }
  };

  const getAverageWait = () => {
    if (reports.length === 0) return "No live data";
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.timeRange] = (counts[r.timeRange] || 0) + 1;
    });
    return Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  return (
    <section className="wait-time-section glass">
      <div className="wait-header">
        <div className="title-area">
          <Clock className="clock-icon" />
          <div>
            <h3>Live Booth Wait Times</h3>
            <p>Real-time crowdsourced estimates for your constituency.</p>
          </div>
        </div>
        <div className="location-selectors">
          <div className="select-group">
            <label>State</label>
            <select value={selectedState} onChange={(e) => {
              const newState = e.target.value;
              setSelectedState(newState);
              const firstDist = Object.keys(LOCATION_DATA[newState])[0] || '';
              setSelectedDistrict(firstDist);
              setSelectedTaluk(LOCATION_DATA[newState][firstDist][0] || '');
            }}>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="select-group">
            <label>District</label>
            <select value={selectedDistrict} onChange={(e) => {
              const newDist = e.target.value;
              setSelectedDistrict(newDist);
              setSelectedTaluk(LOCATION_DATA[selectedState][newDist][0] || '');
            }}>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="select-group">
            <label>Taluk / Zone</label>
            <select value={selectedTaluk} onChange={(e) => { setSelectedTaluk(e.target.value); }}>
              {taluks.map((t: string) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="wait-display">
        <div className="status-hero">
          <div className="status-value">{getAverageWait()}</div>
          <div className="status-label">Estimated wait at {selectedTaluk} booths</div>
        </div>

        <div className="report-action">
          {!isReporting ? (
            <button 
              className="report-btn" 
              onClick={() => { setIsReporting(true); }}
              disabled={isCooldownActive}
            >
              <Users size={18} /> 
              {isCooldownActive ? "Shukriya! Reported Recently" : "Report Live Wait Time"}
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="report-options"
            >
              <p>Booth pe kitna intezar hai?</p>
              <div className="option-grid">
                {['< 15 mins', '15-30 mins', '30-60 mins', '1+ hour'].map(range => (
                  <button key={range} onClick={() => { void submitReport(range); }}>{range}</button>
                ))}
              </div>
              <button className="cancel-link" onClick={() => { setIsReporting(false); }}>Wapas jaye</button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="recent-reports">
        <h4>Constituency Activity</h4>
        <div className="reports-list">
          {reports.map(r => (
            <div key={r.id} className="report-item">
              <div className="dot"></div>
              <span>{r.timeRange}</span>
              <span className="timestamp">
                {r.timestamp ? r.timestamp.toDate().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : "Just now"}
              </span>
            </div>
          ))}
          {reports.length === 0 && <p className="empty-msg">Be the first in {selectedTaluk} to report wait times!</p>}
        </div>
      </div>

      <div className="disclaimer">
        <AlertTriangle size={14} />
        <span>Data verified by the VoterWise community. Jai Hind.</span>
      </div>
    </section>
  );
};

export default WaitTimeMap;
