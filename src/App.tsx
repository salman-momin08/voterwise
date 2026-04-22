import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';

// Root Architecture - Static for Instant LCP
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';

// Deferred Logic - Dynamic Code Splitting
const FeatureShowcase = lazy(() => import('./components/Civic/FeatureShowcase'));
const LiveElectionTicker = lazy(() => import('./components/Civic/LiveElectionTicker'));
const ElectionTimeline = lazy(() => import('./components/Timeline/ElectionTimeline'));
const CivicNavigator = lazy(() => import('./components/Civic/CivicNavigator'));
const CivicAcademy = lazy(() => import('./components/Quiz/CivicAcademy'));
const SampleBallot = lazy(() => import('./components/Ballot/SampleBallot'));
const WaitTimeMap = lazy(() => import('./components/WaitTime/WaitTimeMap'));
const ChatAssistant = lazy(() => import('./components/Chat/ChatAssistant'));
const ConstituencyExplorer = lazy(() => import('./components/Civic/ConstituencyExplorer'));

import { isFirebaseConfigured, getFirebaseAuth } from './lib/firebase';
import { onAuthStateChanged, getRedirectResult, type User } from 'firebase/auth';
import { isGeminiConfigured, useRagContext } from './lib/gemini';

import './index.css';
import './App.css';

type ViewType = 'home' | 'navigator' | 'timeline' | 'ballot' | 'waittime' | 'quiz' | 'explorer';

// High-Fidelity Skeletons
const TickerSkeleton = () => (
  <div className="container" style={{ marginTop: 'var(--space-xl)', marginBottom: '-var(--space-2xl)' }}>
    <div className="shimmer" style={{ height: '40px', borderRadius: '20px', width: '100%' }}></div>
  </div>
);

const ShowcaseSkeleton = () => (
  <div className="container" style={{ padding: '4rem 0' }}>
    <div className="shimmer" style={{ height: '40px', width: '300px', marginBottom: '2rem', borderRadius: '4px' }}></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="shimmer" style={{ height: '200px', borderRadius: '12px' }}></div>
      ))}
    </div>
  </div>
);

const ViewSkeleton = () => (
  <div className="container view-container">
    <div className="shimmer" style={{ height: '40px', width: '400px', marginBottom: '1rem', borderRadius: '4px' }}></div>
    <div className="shimmer" style={{ height: '20px', width: '600px', marginBottom: '3rem', borderRadius: '4px' }}></div>
    <div className="shimmer" style={{ height: '500px', borderRadius: '12px', width: '100%' }}></div>
  </div>
);

function App() {
  const [activeView, setActiveView] = useState<ViewType>(() => {
    const saved = sessionStorage.getItem('voterwise_active_view');
    return (saved as ViewType) || 'home';
  });
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [user, setUser] = useState<User | null>(null);
  const { context: ragContext } = useRagContext();

  useEffect(() => {
    sessionStorage.setItem('voterwise_active_view', activeView);
  }, [activeView]);

  const isConfigComplete = isFirebaseConfigured && isGeminiConfigured;

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      console.warn("🔐 Auth: System not ready yet.");
      return;
    }


    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        setUser(result.user);
      }
    }).catch(err => {
      console.error("Auth Error:", err);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => {
      unsubscribe();
    };
  }, [isConfigComplete]);

  const pageTransition = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
  };

  if (!isConfigComplete) {
    return (
      <div className="setup-container">
        <div className="setup-card glass shimmer">
          <div className="setup-header">
            <Settings className="spin-icon" size={48} />
            <h1>VoterWise Setup</h1>
          </div>
          <p className="setup-intro">Authorizing ECI Grounded Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar 
        activeView={activeView} 
        onNavigate={setActiveView} 
        onToggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)} 
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        user={user}
      />
      
      <main id="main-content">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div key="home" {...pageTransition}>
              <Suspense fallback={<TickerSkeleton />}>
                <div className="container" style={{ marginTop: 'var(--space-xl)', marginBottom: '-var(--space-2xl)' }}>
                  <LiveElectionTicker />
                </div>
              </Suspense>
              
              <Hero onGetStarted={() => setActiveView('navigator')} currentLang={currentLang} />
              
              <Suspense fallback={<ShowcaseSkeleton />}>
                <FeatureShowcase onNavigate={setActiveView} />
              </Suspense>
            </motion.div>
          )}

          {/* Individual Feature Views - Each with its own Suspense for granular loading */}
          {activeView !== 'home' && (
            <Suspense fallback={<ViewSkeleton />}>
              {activeView === 'navigator' && (
                <motion.div key="navigator" {...pageTransition} className="container view-container">
                  <div className="view-header">
                    <h2>Civic Navigator</h2>
                    <p>Follow the authoritative roadmap to voter registration and polling.</p>
                  </div>
                  <CivicNavigator />
                </motion.div>
              )}

              {activeView === 'timeline' && (
                <motion.div key="timeline" {...pageTransition} className="container view-container">
                  <div className="view-header">
                    <h2>Dynamic Election Roadmap</h2>
                    <p>Real-time updates on polling schedules across India.</p>
                  </div>
                  <ElectionTimeline />
                </motion.div>
              )}

              {activeView === 'ballot' && (
                <motion.div key="ballot" {...pageTransition} className="container view-container">
                  <div className="view-header">
                    <h2>Interactive Ballot</h2>
                    <p>Explore candidates in your constituency with AI-powered insights.</p>
                  </div>
                  <SampleBallot />
                </motion.div>
              )}

              {activeView === 'waittime' && (
                <motion.div key="waittime" {...pageTransition} className="container view-container">
                  <div className="view-header">
                    <h2>Live Wait Times</h2>
                    <p>Crowdsourced booth wait estimates for your constituency.</p>
                  </div>
                  <WaitTimeMap />
                </motion.div>
              )}

              {activeView === 'quiz' && (
                <motion.div key="quiz" {...pageTransition} className="container view-container">
                  <div className="view-header">
                    <h2>Voter Knowledge Quiz</h2>
                    <p>Test and strengthen your civic awareness.</p>
                  </div>
                  <CivicAcademy />
                </motion.div>
              )}

              {activeView === 'explorer' && (
                <motion.div key="explorer" {...pageTransition} className="container view-container">
                  <ConstituencyExplorer />
                </motion.div>
              )}
            </Suspense>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Chat Assistant */}
      <Suspense fallback={null}>
        <div className={`floating-assistant ${isAssistantOpen ? 'open' : ''}`}>
          <ChatAssistant context={ragContext || undefined} onClose={() => setIsAssistantOpen(false)} />
        </div>
      </Suspense>

      <footer className="footer glass">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} VoterWise. Authoritative Civic Intelligence for India.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
