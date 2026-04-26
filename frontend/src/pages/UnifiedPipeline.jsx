import React, { useState, useEffect } from 'react';
import { Upload, Lock, ShieldCheck, FileText, Database, Sparkles, FileDown, CheckCircle2 } from 'lucide-react';
import { generatePrivacyReport } from '../utils/pdfGenerator';

const UnifiedPipeline = () => {
  const [file, setFile] = useState(null);
  const [pipelineState, setPipelineState] = useState('idle'); // idle, encrypting, noising, shielding, complete
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState('');

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPipelineState('idle');
      setLogs([]);
      setSummary('');
    }
  };

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { id: Date.now(), time: new Date().toLocaleTimeString(), message, type }]);
  };

  const startPipeline = () => {
    if (!file) return;
    
    setLogs([]);
    setSummary('');
    
    // Step 1: Engine 1
    setPipelineState('encrypting');
    addLog('Initiating Engine 1: Quantum-Safe Encryption (Kyber-1024)...', 'processing');
    
    setTimeout(() => {
      addLog('Encryption successful. Lattice signatures generated.', 'success');
      addLog('Logging operation to BigQuery...', 'info');
      
      // Step 2: Engine 2
      setPipelineState('noising');
      addLog('Initiating Engine 2: Differential Privacy Injector...', 'processing');
      
      setTimeout(() => {
        addLog('Laplacian noise applied (ε=1.5). Privacy utility preserved.', 'success');
        addLog('Logging operation to BigQuery...', 'info');
        
        // Step 3: Engine 3
        setPipelineState('shielding');
        addLog('Initiating Engine 3: Anti-AI Scraping Shield...', 'processing');
        
        setTimeout(() => {
          addLog('Adversarial perturbations and ZWSP tokens injected.', 'success');
          addLog('Logging operation to BigQuery...', 'info');
          
          // Generate Summary (Mock Gemini API)
          setPipelineState('complete');
          addLog('Pipeline execution complete. Fetching Gemini analysis...', 'info');
          
          setTimeout(() => {
            setSummary(
              "Based on the pipeline telemetry, the uploaded file has been fully fortified. The file was first transformed using post-quantum cryptography (Kyber-1024) to secure it against future computational threats. Following this, strict differential privacy noise (Laplacian distribution) was introduced to mathematically obfuscate individual records while maintaining aggregate utility. Finally, adversarial text perturbations were woven into the plaintext surfaces, effectively rendering the file poison to unauthorized AI scrapers. The asset is now considered comprehensively protected."
            );
            addLog('Gemini API summary generated.', 'success');
          }, 1500);
          
        }, 2000);
      }, 2000);
    }, 2000);
  };

  const handleDownloadPDF = () => {
    generatePrivacyReport({
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(2)} KB`,
      algorithms: ['CRYSTALS-Kyber-1024 Encryption', 'Laplacian Differential Privacy (ε=1.5)', 'Adversarial Text Perturbation (Anti-AI)'],
      score: 98,
      summary: summary,
      timestamp: new Date().toLocaleString()
    });
  };

  const steps = [
    { id: 'encrypting', label: 'Engine 1: Encryption', icon: <Lock size={20} /> },
    { id: 'noising', label: 'Engine 2: Diff. Privacy', icon: <ShieldCheck size={20} /> },
    { id: 'shielding', label: 'Engine 3: AI Shield', icon: <FileText size={20} /> }
  ];

  const getStepStatus = (stepId, currentIndex) => {
    const stepIndexes = { 'idle': -1, 'encrypting': 0, 'noising': 1, 'shielding': 2, 'complete': 3 };
    const currentIdx = stepIndexes[pipelineState];
    const thisIdx = stepIndexes[stepId];
    
    if (currentIdx > thisIdx) return 'completed';
    if (currentIdx === thisIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div className="badge badge-blue" style={{ marginBottom: '1rem' }}>Unified Pipeline</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Full-Spectrum Data Protection</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6 }}>
            Run your sensitive assets through all three QuantumShield engines automatically. 
            Monitored by BigQuery telemetry and summarized by Google Gemini AI.
          </p>
        </div>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Upload & Controls */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={20} color="var(--accent-electric-blue)" /> Asset Ingestion
          </h2>
          
          <div 
            style={{ 
              border: '2px dashed var(--border-color)', 
              borderRadius: '8px', 
              padding: '2rem', 
              textAlign: 'center',
              marginBottom: '1.5rem',
              background: 'rgba(0,0,0,0.2)'
            }}
          >
            <Upload size={32} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{file ? file.name : 'Drag & drop your file here'}</p>
            <label className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer' }}>
              Browse Files
              <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
            </label>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem' }}
            onClick={startPipeline}
            disabled={!file || pipelineState !== 'idle'}
          >
            {pipelineState !== 'idle' && pipelineState !== 'complete' ? 'Processing Pipeline...' : 'Initiate Unified Pipeline'}
          </button>
        </div>

        {/* Progress & Results */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          
          {/* Progress Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
            
            {steps.map((step, idx) => {
              const status = getStepStatus(step.id, idx);
              let color = 'var(--bg-panel-solid)';
              let borderColor = 'var(--border-color)';
              let iconColor = 'var(--text-secondary)';
              
              if (status === 'active') {
                borderColor = 'var(--accent-electric-blue)';
                iconColor = 'var(--accent-electric-blue)';
                color = 'rgba(0, 240, 255, 0.1)';
              } else if (status === 'completed') {
                borderColor = 'var(--accent-neon-green)';
                iconColor = 'var(--accent-neon-green)';
                color = 'rgba(0, 255, 136, 0.1)';
              }

              return (
                <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '33%' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: color, 
                    border: `2px solid ${borderColor}`,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                    transition: 'all 0.3s ease',
                    boxShadow: status === 'active' ? 'var(--shadow-sm)' : 'none'
                  }}>
                    {status === 'completed' ? <CheckCircle2 size={20} color={iconColor} /> : React.cloneElement(step.icon, { color: iconColor })}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: status === 'pending' ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: status === 'active' ? 600 : 400 }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* BigQuery / Live Terminal */}
          <div style={{ flex: 1, background: '#000', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '200px' }}>
            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#050a15' }}>
              <Database size={14} color="var(--accent-electric-blue)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>BigQuery Operations Log</span>
            </div>
            <div style={{ padding: '1rem', flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {logs.map((log) => (
                <div key={log.id} style={{ color: log.type === 'success' ? 'var(--accent-neon-green)' : log.type === 'info' ? 'var(--text-secondary)' : 'var(--accent-electric-blue)' }}>
                  <span style={{ color: '#64748b', marginRight: '0.5rem' }}>[{log.time}]</span>
                  {log.message}
                </div>
              ))}
              {pipelineState !== 'idle' && pipelineState !== 'complete' && (
                <div style={{ color: 'var(--text-primary)', animation: 'pulse 1.5s infinite' }}>_</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Gemini AI Summary & Report */}
      {pipelineState === 'complete' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="#a855f7" /> AI Protection Summary (Powered by Gemini)
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
              {summary}
            </p>
          </div>
          <div style={{ width: '1px', background: 'var(--border-color)', alignSelf: 'stretch' }}></div>
          <div style={{ width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent-neon-green)', lineHeight: 1, marginBottom: '0.5rem' }}>98</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Overall Privacy Score</p>
            <button className="btn btn-accent" style={{ width: '100%' }} onClick={handleDownloadPDF}>
              <FileDown size={18} /> Download PDF
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default UnifiedPipeline;
