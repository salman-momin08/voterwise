import React, { useState, useEffect, useRef } from 'react';
import { getFirebaseAuth } from '../../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, type User } from 'firebase/auth';
import { Vote, LogOut, Menu, X, Map, Clock, FileCheck, BookOpen, MessageCircle, BarChart3, Languages, Globe } from 'lucide-react';
import './Navbar.css';

type ViewType = 'home' | 'navigator' | 'timeline' | 'ballot' | 'waittime' | 'quiz' | 'explorer';

interface NavbarProps {
  activeView: string;
  onNavigate: (view: ViewType) => void;
  onToggleAssistant: () => void;
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  user: User | null;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'ur', label: 'اردو' },
];

const Navbar: React.FC<NavbarProps> = ({ activeView, onNavigate, onToggleAssistant, currentLang, onLanguageChange, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const handleLogin = async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
  };

  const navTo = (view: ViewType) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  const currentLangLabel = LANGUAGES.find(l => l.code === currentLang)?.label ?? 'English';

  return (
    <nav className="navbar glass" role="navigation" aria-label="Main Navigation">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => { navTo('home'); }} style={{ cursor: 'pointer' }}>
          <Vote className="logo-icon" size={26} />
          <span className="logo-text">Voter<span>Wise</span></span>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <button className={`nav-item ${activeView === 'navigator' ? 'active' : ''}`} onClick={() => { navTo('navigator'); }}>
            <Map size={14} /> Roadmap
          </button>
          <button className={`nav-item ${activeView === 'timeline' ? 'active' : ''}`} onClick={() => { navTo('timeline'); }}>
            <Clock size={14} /> Timeline
          </button>
          <button className={`nav-item ${activeView === 'ballot' ? 'active' : ''}`} onClick={() => { navTo('ballot'); }}>
            <FileCheck size={14} /> Ballot
          </button>
          <button className={`nav-item ${activeView === 'waittime' ? 'active' : ''}`} onClick={() => { navTo('waittime'); }}>
            <BarChart3 size={14} /> Live Wait
          </button>
          <button className={`nav-item ${activeView === 'quiz' ? 'active' : ''}`} onClick={() => { navTo('quiz'); }}>
            <BookOpen size={14} /> Quiz
          </button>
          <button className={`nav-item ${activeView === 'explorer' ? 'active' : ''}`} onClick={() => { navTo('explorer'); }}>
            <Globe size={14} /> Explorer
          </button>

          <div className="nav-separator" />

          {/* Persistent Cache Language Selector */}
          <div className="lang-selector" ref={langRef}>
            <button
              className="lang-toggle"
              onClick={() => { setIsLangOpen(!isLangOpen); }}
              aria-expanded={isLangOpen}
              aria-label="Select language"
            >
              <Languages size={14} />
              <span>{currentLangLabel}</span>
              <span className="lang-arrow">▾</span>
            </button>
            {isLangOpen && (
              <div className="lang-dropdown">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    className={`lang-option ${lang.code === currentLang ? 'active' : ''}`}
                    onClick={() => {
                      const langCode = lang.code;
                      // Set Google Translate cookie
                      document.cookie = `googtrans=/en/${langCode}; path=/`;
                      document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${window.location.hostname}`;
                      
                      onLanguageChange(langCode);
                      setIsLangOpen(false);
                      
                      // Small delay then reload to ensure Google Translate picks up the cookie
                      setTimeout(() => {
                        window.location.reload();
                      }, 100);
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="nav-item assistant-btn" onClick={() => { onToggleAssistant(); setIsMenuOpen(false); }}>
            <MessageCircle size={14} /> Assistant
          </button>

          <div className="nav-auth">
            {user ? (
              <div className="user-profile">
                <div className="user-info">
                  <img src={user.photoURL ?? ''} alt="" className="avatar" />
                  <span className="username">{user.displayName ?? 'Voter'}</span>
                </div>
                <button onClick={() => { void handleLogout(); }} className="logout-btn" aria-label="Log out">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={() => { void handleLogin(); }} className="login-btn" id="login-btn">
                Join Community
              </button>
            )}
          </div>
        </div>

        <button 
          className="menu-toggle" 
          onClick={() => { setIsMenuOpen(!isMenuOpen); }}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
