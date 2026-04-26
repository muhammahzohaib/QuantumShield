import React from 'react';
import { Settings, AlertTriangle } from 'lucide-react';

const Placeholder = ({ title, description }) => {
  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
      </div>

      <div className="glass-panel flex-center" style={{ flex: 1, flexDirection: 'column', padding: '3rem', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: 'rgba(0, 240, 255, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <Settings size={40} color="var(--accent-electric-blue)" style={{ animation: 'spin 10s linear infinite' }} />
        </div>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Module Under Construction</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.6 }}>
          The {title} interface is currently being built by our engineering team. Core APIs are already active in the background. Full UI controls will be available in the next platform update.
        </p>

        <div style={{ display: 'flex', gap: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem 1.5rem', borderRadius: '8px', alignItems: 'flex-start', textAlign: 'left', maxWidth: '600px' }}>
          <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ color: '#f59e0b', marginBottom: '0.25rem' }}>Developer Preview</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              For early access to the API endpoints for this module, please consult the QuantumShield Developer Documentation or contact your dedicated solutions architect.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Placeholder;
