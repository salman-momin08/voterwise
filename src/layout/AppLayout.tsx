import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import type { User } from 'firebase/auth';

type ViewType = 'home' | 'navigator' | 'timeline' | 'ballot' | 'waittime' | 'quiz' | 'explorer';

interface AppLayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  user: User | null;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  activeView, 
  setActiveView, 
  isAssistantOpen, 
  setIsAssistantOpen, 
  currentLang, 
  setCurrentLang, 
  user 
}) => {
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
        {children}
      </main>

      <footer className="footer glass">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} VoterWise. Authoritative Civic Intelligence for India.</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
