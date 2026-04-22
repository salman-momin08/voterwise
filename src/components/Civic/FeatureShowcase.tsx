import React from 'react';
import { motion } from 'framer-motion';
import { Map, Clock, Vote, Calendar, Navigation2, Search } from 'lucide-react';
import './FeatureShowcase.css';

interface FeatureShowcaseProps {
  onNavigate: (view: 'home' | 'navigator' | 'timeline' | 'ballot' | 'waittime' | 'quiz' | 'explorer') => void;
}

const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'navigator',
      title: 'Civic Navigator',
      description: 'Follow the authoritative step-by-step roadmap to successful voter registration and polling.',
      icon: Navigation2,
      color: '#ff9933',
      action: 'Start Journey'
    },
    {
      id: 'timeline',
      title: 'Election Roadmap',
      description: 'Track real-time polling schedules and critical ECI deadlines for your specific constituency.',
      icon: Calendar,
      color: '#3b82f6',
      action: 'View Schedule'
    },
    {
      id: 'ballot',
      title: 'Sample Ballot',
      description: 'Experience a realistic voting simulation to familiarize yourself with the ballot process.',
      icon: Vote,
      color: '#138808',
      action: 'Practice Vote'
    },
    {
      id: 'waittime',
      title: 'Live Wait Times',
      description: 'Monitor real-time traffic and queue length at your local polling station before you head out.',
      icon: Clock,
      color: '#ef4444',
      action: 'Check Wait'
    },
    {
      id: 'explorer',
      title: 'Constituency Explorer',
      description: 'Deep-dive into regional data, candidate information, and historical voting intelligence.',
      icon: Search,
      color: '#8b5cf6',
      action: 'Explore Map'
    }
  ];

  return (
    <section className="feature-showcase container">
      <div className="showcase-header">
        <h2 className="section-title">Authoritative Civic Toolkit</h2>
        <p className="section-subtitle">Everything you need for an informed and seamless democratic experience.</p>
      </div>

      <div className="feature-grid">
        {features.map((feature, idx) => (
          <motion.div 
            key={feature.id}
            className="feature-card glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onNavigate(feature.id)}
          >
            <div className="feature-icon-wrapper" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
              <feature.icon size={24} />
            </div>
            <div className="feature-content">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button className="feature-link">
                {feature.action} <Navigation2 size={14} style={{ transform: 'rotate(90deg)' }} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureShowcase;
