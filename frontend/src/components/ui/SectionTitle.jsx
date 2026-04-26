import React from 'react';
import './ui-styles.css';

const SectionTitle = ({ title, subtitle, className = '', ...props }) => {
  return (
    <div className={`section-title-container ${className}`} {...props}>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
