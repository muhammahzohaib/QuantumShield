import React from 'react';
import './ui-styles.css';

const StatusBadge = ({ label, variant = 'primary', className = '', ...props }) => {
  return (
    <span 
      className={`status-badge ${variant} ${className}`} 
      {...props}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
