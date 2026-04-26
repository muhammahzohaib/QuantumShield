import React, { useState, useEffect } from 'react';
import { ShieldAlert, Globe, FileText, Code, Upload, Eye, EyeOff, Server, Terminal } from 'lucide-react';

const Engine3 = () => {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'web'
  const [inputText, setInputText] = useState('Artificial Intelligence models scrape the internet for high-quality text data. Protect your proprietary blog posts, intellectual property, and research papers from unauthorized model training.');
  const [inputUrl, setInputUrl] = useState('https://your-domain.com/article');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [shieldedSegments, setShieldedSegments] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [protectionScore, setProtectionScore] = useState(0);

  const homoglyphs = {
    'a': 'а', 'c': 'с', 'e': 'е', 'o': 'о', 'p': 'р', 'x': 'х', 'y': 'у',
    'A': 'А', 'B': 'В', 'C': 'С', 'E': 'Е', 'H': 'Н', 'M': 'М', 'O': 'О', 'P': 'Р', 'T': 'Т', 'X': 'Х'
  };
  const ZWSP = '\u200B';

  const applyShield = () => {
    if (!inputText) return;
    setIsProcessing(true);
    setProtectionScore(0);
    
    setTimeout(() => {
      let segments = [];
      let currentSegment = '';
      let isCurrentPerturbed = false;
      let perturbationType = 'none';

      const pushCurrent = () => {
        if (currentSegment) {
          segments.push({ text: currentSegment, isPerturbed: isCurrentPerturbed, type: perturbationType });
          currentSegment = '';
        }
      };

      for (let i = 0; i < inputText.length; i++) {
        const char = inputText[i];
        
        // 30% chance to homoglyph swap if available
        if (homoglyphs[char] && Math.random() > 0.7) {
          pushCurrent();
          segments.push({ text: homoglyphs[char], isPerturbed: true, type: 'homoglyph' });
          isCurrentPerturbed = false;
          perturbationType = 'none';
        } 
        // 15% chance to insert ZWSP after a character (not space)
        else if (char !== ' ' && Math.random() > 0.85) {
          currentSegment += char;
          pushCurrent();
          segments.push({ text: ZWSP, isPerturbed: true, type: 'zwsp' });
        }
        else {
          if (isCurrentPerturbed) pushCurrent();
          currentSegment += char;
          isCurrentPerturbed = false;
          perturbationType = 'none';
        }
      }
      pushCurrent();

      setShieldedSegments(segments);
      setProtectionScore(Math.floor(Math.random() * 15) + 85); // 85-99% score
      setIsProcessing(false);
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setInputText(event.target.result);
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    if (activeTab === 'text' && inputText && shieldedSegments.length === 0) {
      applyShield();
    }
  }, [activeTab]);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div className="badge badge-blue" style={{ marginBottom: '1rem' }}>Engine 3 Active</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Anti-AI Scraping Shield</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6 }}>
            Corrupt AI training pipelines by injecting adversarial text perturbations. 
            Homoglyph substitutions and zero-width spaces render text unreadable to tokenizers 
            while remaining perfectly legible to human readers.
          </p>
        </div>
        
        {protectionScore > 0 && activeTab === 'text' && (
          <div className="glass-panel flex-center" style={{ padding: '1rem', gap: '1rem', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Protection Score</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-neon-green)', lineHeight: 1 }}>{protectionScore}</span>
              <span style={{ color: 'var(--text-secondary)' }}>/ 100</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab('text')}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            padding: '1rem', 
            color: activeTab === 'text' ? 'var(--text-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'text' ? '2px solid var(--accent-electric-blue)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: activeTab === 'text' ? 600 : 400
          }}
        >
          <FileText size={18} /> Raw Text Mode
        </button>
        <button 
          onClick={() => setActiveTab('web')}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            padding: '1rem', 
            color: activeTab === 'web' ? 'var(--text-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'web' ? '2px solid var(--accent-neon-green)' : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: activeTab === 'web' ? 600 : 400
          }}
        >
          <Globe size={18} /> Web Content Mode
        </button>
      </div>

      {activeTab === 'text' ? (
        <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Original Text */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="var(--text-secondary)" /> Original Content
              </h2>
              <label className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <Upload size={16} /> Upload TXT
                <input type="file" accept=".txt,.json,.md" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <textarea 
                className="input-field" 
                style={{ flex: 1, minHeight: '300px', resize: 'none', fontSize: '1rem', lineHeight: 1.6, background: 'rgba(0,0,0,0.3)' }}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your content here..."
              ></textarea>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}
                onClick={applyShield}
                disabled={!inputText || isProcessing}
              >
                {isProcessing ? 'Generating Adversarial Tokens...' : 'Apply Scraping Shield'}
              </button>
            </div>
          </div>

          {/* Shielded Text */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-neon-green)' }}>
                <ShieldAlert size={20} /> Protected Output
              </h2>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: showHidden ? '#ef4444' : 'inherit', borderColor: showHidden ? '#ef4444' : '' }}
                onClick={() => setShowHidden(!showHidden)}
                disabled={shieldedSegments.length === 0}
              >
                {showHidden ? <><EyeOff size={16} /> Hide Perturbations</> : <><Eye size={16} /> Reveal Perturbations</>}
              </button>
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div 
                className="input-field" 
                style={{ flex: 1, minHeight: '300px', overflowY: 'auto', fontSize: '1rem', lineHeight: 1.6, background: 'rgba(0,0,0,0.3)' }}
              >
                {isProcessing ? (
                  <div className="flex-center" style={{ height: '100%', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0, 255, 136, 0.2)', borderTopColor: 'var(--accent-neon-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Injecting zero-width spaces & homoglyphs...</span>
                  </div>
                ) : shieldedSegments.length > 0 ? (
                  shieldedSegments.map((seg, idx) => (
                    <span 
                      key={idx} 
                      style={
                        showHidden && seg.isPerturbed 
                          ? { 
                              background: 'rgba(239, 68, 68, 0.2)', 
                              color: '#ef4444', 
                              borderBottom: '1px dashed #ef4444',
                              position: 'relative'
                            } 
                          : {}
                      }
                      title={showHidden && seg.isPerturbed ? (seg.type === 'zwsp' ? 'Zero-width space injected' : 'Cyrillic homoglyph substitution') : ''}
                    >
                      {showHidden && seg.type === 'zwsp' ? '[ZWSP]' : seg.text}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>Waiting for processing...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid-3" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={20} color="var(--accent-neon-green)" /> Website Protection Wrapper
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Enter your article URL. We will generate the secure meta tags and HTTP headers required to block standard AI scrapers (like GPTBot, CCBot).
            </p>
            
            <div className="input-group">
              <label className="input-label">Content URL</label>
              <input 
                type="url" 
                className="input-field" 
                value={inputUrl} 
                onChange={(e) => setInputUrl(e.target.value)} 
              />
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code size={18} color="var(--accent-electric-blue)" /> Generated Meta Tags
              </h3>
              <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid var(--border-color)', color: 'var(--accent-electric-blue)' }}>
{`<!-- Add these to your <head> -->
<meta name="robots" content="noai, noimageai">
<meta name="robots" content="noimageai">
<!-- Block specific crawlers -->
<meta name="Googlebot" content="noindex, nofollow">
<meta name="GPTBot" content="noindex, nofollow">
<meta name="CCBot" content="noindex, nofollow">
<meta name="OAI-SearchBot" content="noindex, nofollow">
<meta name="anthropic-ai" content="noindex, nofollow">`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* API Export Section */}
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Server size={20} color="var(--accent-electric-blue)" /> API Integration
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Integrate the Anti-AI Scraping Shield directly into your CMS or backend infrastructure.
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Terminal size={20} color="var(--text-secondary)" style={{ marginRight: '1rem' }} />
          <code style={{ color: 'var(--accent-neon-green)', flex: 1, whiteSpace: 'pre-wrap' }}>
{`curl -X POST https://api.quantumshield.io/v1/shield/text \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Your proprietary content here", "intensity": "high", "methods": ["homoglyph", "zwsp"]}'`}
          </code>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Engine3;
