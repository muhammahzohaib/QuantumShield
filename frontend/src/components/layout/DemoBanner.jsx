import React from 'react';
import { Shield } from 'lucide-react';

const DemoBanner = () => {
  return (
    <div className="demo-banner">
      <Shield size={14} className="mr-2" />
      <span className="hide-on-mobile">🛡️ QuantumShield Demo | Google AI Competition 2025</span>
      <span className="show-only-mobile">🛡️ QuantumShield Demo | Google AI 2025</span>
    </div>
  );
};

export default DemoBanner;
