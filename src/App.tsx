import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';

import AppLayout from './layout/AppLayout';
import ViewRouter from './router/ViewRouter';

const ChatAssistant = lazy(() => import('./components/Chat/ChatAssistant'));

import { isFirebaseConfigured, getFirebaseAuth } from './lib/firebase';
import { onAuthStateChanged, getRedirectResult, type User } from 'firebase/auth';
import { isGeminiConfigured, useRagContext } from './lib/gemini';

import './index.css';
import './App.css';

type ViewType = 'home' | 'navigator' | 'timeline' | 'ballot' | 'waittime' | 'quiz' | 'explorer';

function App() {
  const [activeView, setActiveView] = useState<ViewType>(() => {
    const saved = sessionStorage.getItem('voterwise_active_view');
    return (saved as ViewType) ?? 'home';
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

    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        setUser(result.user);
      }
    }).catch((err: unknown) => {
      console.error("Auth Error:", err);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => {
      unsubscribe();
    };
  }, [isConfigComplete]);

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
    <AppLayout 
      activeView={activeView} 
      setActiveView={setActiveView} 
      isAssistantOpen={isAssistantOpen} 
      setIsAssistantOpen={setIsAssistantOpen} 
      currentLang={currentLang} 
      setCurrentLang={setCurrentLang} 
      user={user}
    >
      <ViewRouter 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />

      {/* Floating Chat Assistant */}
      <AnimatePresence>
        {isAssistantOpen && (
          <Suspense fallback={null}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="floating-assistant open"
            >
              <ChatAssistant context={ragContext ?? undefined} onClose={() => { setIsAssistantOpen(false); }} />
            </motion.div>
          </Suspense>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

export default App;
