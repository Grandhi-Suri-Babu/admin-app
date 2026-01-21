import React from 'react';
import './CollapsibleSection.css';

const CollapsibleSection = ({ 
  title, 
  isExpanded, 
  onToggle, 
  children,
  highlight = false 
}) => {
  return (
    <div className={`collapsible-section ${isExpanded ? 'expanded' : ''} ${highlight ? 'highlight' : ''}`}>
      <button 
        type="button"
        className="collapsible-header"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <span className="collapsible-title">{title}</span>
        <span className={`collapsible-icon ${isExpanded ? 'rotated' : ''}`}>
          ▼
        </span>
      </button>
      <div className={`collapsible-content ${isExpanded ? 'show' : ''}`}>
        <div className="collapsible-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;

