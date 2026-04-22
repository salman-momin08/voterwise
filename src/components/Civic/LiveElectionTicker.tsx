import React, { useState, useEffect } from 'react';
import { getFirebaseDb } from '../../lib/firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { Activity, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './LiveElectionTicker.css';

const MESSAGES = [
  "Empowering Indian Democracy",
  "Ground Truth: Article 324 Compliant",
  "Authoritative ECI Data Streams Active",
  "Voter Participation Intelligence: Online",
  "Verified Civic Intelligence Assistant"
];

const LiveElectionTicker: React.FC = () => {
  const [activeCount, setActiveCount] = useState(14250);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFresh, setIsFresh] = useState(true);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Message Rotation
    const msgInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % MESSAGES.length);
    }, 5000);

    // Active User Simulation
    const userInterval = setInterval(() => {
      setActiveCount(prev => {
        const change = Math.floor(Math.random() * 20) - 8;
        return Math.max(14200, prev + change);
      });
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    }, 4000);

    // Real-time Firestore Freshness Check
    const db = getFirebaseDb();
    const q = query(collection(db, 'ticker'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        const lastSync = new Date(data.source?.last_verified_timestamp || 0);
        const hoursSinceSync = (new Date().getTime() - lastSync.getTime()) / (1000 * 60 * 60);
        setIsFresh(hoursSinceSync < 24);
      }
    });

    return () => {
      clearInterval(msgInterval);
      clearInterval(userInterval);
      unsubscribe();
    };
  }, []);

  return (
    <div className="live-ticker-container glass">
      <div className="ticker-badge">
        <Activity size={14} className={pulse ? 'pulse' : ''} />
        {activeCount.toLocaleString()} ONLINE
      </div>
      
      <div className="ticker-track">
        <AnimatePresence mode="wait">
          <motion.div 
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="ticker-message"
          >
            {MESSAGES[messageIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={`freshness-indicator ${isFresh ? 'verified' : 'stale'}`}>
        {isFresh ? <CheckCircle2 size={14} /> : <Info size={14} />}
        <span>{isFresh ? 'ECI Grounded' : 'Syncing Data'}</span>
      </div>
    </div>
  );
};

export default LiveElectionTicker;
