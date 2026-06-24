import React from 'react';
import '../../styles/NarrativeTipCard.css';

const NarrativeTipCard = ({ icon, title, narrative, explanation }) => {
  return (
    <div className="narrative-tip-card">
      <div className="tip-header">
        <span className="tip-icon" aria-label="icon">{icon}</span>
        <h4 className="tip-title">{title}</h4>
      </div>
      <div className="tip-body">
        <p className="tip-narrative">{narrative}</p>
        {explanation && (
          <p className="tip-explanation">
            <span className="tip-label">Why this helps:</span> {explanation}
          </p>
        )}
      </div>
    </div>
  );
};

export default NarrativeTipCard;