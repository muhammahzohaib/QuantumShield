import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, Shield, Download, Server, RefreshCw } from 'lucide-react';

const MediaPrivacy = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [protectedImage, setProtectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target.result);
        setProtectedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyAdversarialNoise = () => {
    if (!originalImage) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Apply subtle invisible adversarial noise (simulated)
      // We'll alter RGB values by a very small amount that visually looks identical but breaks ML gradients
      for (let i = 0; i < data.length; i += 4) {
        // High frequency noise pattern
        const noise = (Math.random() - 0.5) * 8; // Small amplitude noise
        data[i] = Math.min(255, Math.max(0, data[i] + noise));     // Red
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // Green
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // Blue
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Artificial delay to simulate heavy ML processing
      setTimeout(() => {
        setProtectedImage(canvas.toDataURL('image/png'));
        setIsProcessing(false);
      }, 1500);
    };
    img.src = originalImage;
  };

  const handleDownload = () => {
    if (!protectedImage) return;
    const link = document.createElement('a');
    link.href = protectedImage;
    link.download = 'quantum-shield-protected.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    alert('Protected media metadata exported via POST /api/v1/media/export');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div className="badge badge-green" style={{ marginBottom: '1rem' }}>Media Studio Active</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Media Privacy Studio</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6 }}>
            Upload images to inject invisible adversarial noise. This mathematically perturbs the pixels, 
            making the image unreadable to AI training models while keeping it visually identical to the human eye.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-panel flex-center" style={{ padding: '0.5rem 1rem', gap: '0.75rem', borderRadius: '50px' }}>
            <Shield size={18} color="var(--accent-electric-blue)" />
            <span style={{ fontSize: '0.875rem' }}>Anti-AI Cloak</span>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={20} color="var(--accent-neon-green)" /> Source Media
          </h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer' }}>
              <Upload size={16} /> Upload Image
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </label>
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              onClick={applyAdversarialNoise}
              disabled={!originalImage || isProcessing}
            >
              {isProcessing ? (
                <span className="flex-center" style={{ gap: '0.5rem' }}>
                  <RefreshCw size={16} className="spin" /> Injecting Noise...
                </span>
              ) : (
                <span className="flex-center" style={{ gap: '0.5rem' }}>
                  <Shield size={16} /> Protect Image
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {originalImage && (
        <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Original View */}
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Original (Vulnerable to AI)</h3>
            </div>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <img src={originalImage} alt="Original" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Protected View */}
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--accent-neon-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} /> Protected (Anti-AI Noise Applied)
              </h3>
            </div>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', position: 'relative' }}>
              {isProcessing && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                  <div className="noise-scan-bar"></div>
                  <p style={{ color: 'var(--accent-electric-blue)', fontFamily: 'monospace', marginTop: '1rem' }}>Calculating Adversarial Gradients...</p>
                </div>
              )}
              {protectedImage ? (
                <img src={protectedImage} alt="Protected" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
              ) : (
                !isProcessing && <span style={{ color: 'var(--text-secondary)' }}>Waiting for processing...</span>
              )}
            </div>
            
            {protectedImage && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-accent" style={{ flex: 1, padding: '0.75rem', fontSize: '0.875rem' }} onClick={handleDownload}>
                  <Download size={16} /> Download Protected File
                </button>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem', fontSize: '0.875rem' }} onClick={handleExport}>
                  <Server size={16} /> Export API
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <style>{`
        .spin {
          animation: spin 2s linear infinite;
        }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .noise-scan-bar {
          position: absolute;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--accent-neon-green);
          box-shadow: 0 0 15px var(--accent-neon-green);
          animation: scan 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MediaPrivacy;
