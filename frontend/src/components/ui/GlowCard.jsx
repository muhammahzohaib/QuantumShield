import React from 'react';
import './ui-styles.css';

const GlowCard = ({ children, className = '', ...props }) => {
  return (
    <div className={`glow-card ${className}`} {...props}>
      {children}
    </div>
  );
};

export default GlowCard;
