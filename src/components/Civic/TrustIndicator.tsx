import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import type { SourceAttribution } from '../../types/civic';
import { formatAttribution } from '../../middleware/sourceValidator';

interface TrustIndicatorProps {
  source: SourceAttribution;
  className?: string;
}

const TrustIndicator: React.FC<TrustIndicatorProps> = ({ source, className = '' }) => {
  return (
    <div className={`trust-indicator ${className}`}>
      <div className="trust-badge glass">
        <ShieldCheck size={14} className="trust-icon" />
        <span className="trust-text">{formatAttribution(source)}</span>
        <a 
          href={source.authority_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="trust-link"
          aria-label={`Visit ${source.authority_name}`}
        >
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

export default TrustIndicator;
