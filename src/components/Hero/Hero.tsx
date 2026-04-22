import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play, CheckCircle2, Sparkles, Shield } from 'lucide-react';
import { useTranslate } from '../../hooks/useTranslate';
import './Hero.css';

interface HeroProps {
  onGetStarted: () => void;
  currentLang: string;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, currentLang }) => {
  // Translate title in segments to maintain Tri-color styling on "Adhikar"
  const { translated: titlePart1 } = useTranslate("Your Vote is Your ", currentLang);
  const { translated: adhikarText } = useTranslate("Adhikar", currentLang);
  const { translated: titlePart2 } = useTranslate(". Make it Count.", currentLang);
  
  const { translated: description } = useTranslate(
    "Demystify the Indian election process with VoterWise. Get personalized ECI deadlines, AI-powered civic guidance, and everything you need to lead your constituency.", 
    currentLang
  );
  
  const { translated: getStartedText } = useTranslate("Get Started", currentLang);
  const { translated: watchText } = useTranslate("Watch How it Works", currentLang);

  return (
    <section className="hero-section" aria-label="Introduction">
      <div className="hero-grid container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 1, x: 0 }} // Start visible to fix LCP
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 style={{ opacity: 1 }}>
            {titlePart1}
            <span className="adhikar-span">{adhikarText}</span>
            {titlePart2}
          </h1>
          
          <p className="hero-description">{description}</p>

          <div className="hero-actions">
            <button className="btn-primary" id="get-started-btn" onClick={onGetStarted}>
              {getStartedText} <ChevronRight size={18} />
            </button>
            <button className="btn-secondary" id="watch-btn">
              <Play size={16} fill="currentColor" /> {watchText}
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <CheckCircle2 size={18} className="stat-icon" />
              <span>ECI Verified Rules</span>
            </div>
            <div className="stat-item">
              <Sparkles size={18} className="stat-icon" />
              <span>AI-Powered Insights</span>
            </div>
            <div className="stat-item">
              <Shield size={18} className="stat-icon" />
              <span>Secure & Private</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <div className="visual-card glass">
            <div className="card-header">
              <div className="dots"><span></span><span></span><span></span></div>
              <div className="header-title">System Status: Authoritative</div>
            </div>
            <div className="card-body">
              <div className="status-item">
                <div className="status-label">ECI Ingestion Pipeline</div>
                <div className="status-progress">
                  <div className="progress-fill" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="status-message">
                <Shield size={14} /> Synchronized with Official ECI Data Hub
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="blob-1"></div>
          <div className="blob-2"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
