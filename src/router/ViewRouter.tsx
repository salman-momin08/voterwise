import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero/Hero';

type ViewType = 'home' | 'navigator' | 'timeline' | 'ballot' | 'waittime' | 'quiz' | 'explorer';

// Deferred Logic - Dynamic Code Splitting
const FeatureShowcase = lazy(() => import('../components/Civic/FeatureShowcase'));
const LiveElectionTicker = lazy(() => import('../components/Civic/LiveElectionTicker'));
const ElectionTimeline = lazy(() => import('../components/Timeline/ElectionTimeline'));
const CivicNavigator = lazy(() => import('../components/Civic/CivicNavigator'));
const CivicAcademy = lazy(() => import('../components/Quiz/CivicAcademy'));
const SampleBallot = lazy(() => import('../components/Ballot/SampleBallot'));
const WaitTimeMap = lazy(() => import('../components/WaitTime/WaitTimeMap'));
const ConstituencyExplorer = lazy(() => import('../components/Civic/ConstituencyExplorer'));

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

interface ViewRouterProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  currentLang: string;
}

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
};

const ViewRouter: React.FC<ViewRouterProps> = ({ activeView, setActiveView, currentLang }) => {
  return (
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
                <h1>Civic Navigator</h1>
                <p>Follow the authoritative roadmap to voter registration and polling.</p>
              </div>
              <CivicNavigator />
            </motion.div>
          )}

          {activeView === 'timeline' && (
            <motion.div key="timeline" {...pageTransition} className="container view-container">
              <div className="view-header">
                <h1>Dynamic Election Roadmap</h1>
                <p>Real-time updates on polling schedules across India.</p>
              </div>
              <ElectionTimeline />
            </motion.div>
          )}

          {activeView === 'ballot' && (
            <motion.div key="ballot" {...pageTransition} className="container view-container">
              <div className="view-header">
                <h1>Interactive Ballot</h1>
                <p>Explore candidates in your constituency with AI-powered insights.</p>
              </div>
              <SampleBallot />
            </motion.div>
          )}

          {activeView === 'waittime' && (
            <motion.div key="waittime" {...pageTransition} className="container view-container">
              <div className="view-header">
                <h1>Live Wait Times</h1>
                <p>Crowdsourced booth wait estimates for your constituency.</p>
              </div>
              <WaitTimeMap />
            </motion.div>
          )}

          {activeView === 'quiz' && (
            <motion.div key="quiz" {...pageTransition} className="container view-container">
              <div className="view-header">
                <h1>Voter Knowledge Quiz</h1>
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
  );
};

export default ViewRouter;
