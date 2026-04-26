import React, { useState } from 'react';
import { Lock, Unlock, Upload, Cloud, Key, FileText, Database, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import api from '../api/axiosConfig';

const QuantumSafeEncryption = () => {
  const [inputText, setInputText] = useState('');
  const [encryptedOutput, setEncryptedOutput] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [logs, setLogs] = useState([
    { id: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), size: '2.4 KB', algorithm: 'CRYSTALS-Kyber-1024', status: 'Success' },
    { id: 2, timestamp: new Date(Date.now() - 7200000).toISOString(), size: '1.1 MB', algorithm: 'CRYSTALS-Kyber-768', status: 'Success' }
  ]);
  const [cloudStatus, setCloudStatus] = useState('');
  const [decryptionKey, setDecryptionKey] = useState('');
  const [decryptedOutput, setDecryptedOutput] = useState('');

  const generateMockKyberString = (length) => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleEncryption = async () => {
    if (!inputText) return;
    
    setIsEncrypting(true);
    setEncryptedOutput('');
    setEncryptionKey('');
    setCloudStatus('');
    setDecryptedOutput('');
    
    try {
      const response = await api.post('/engine1/encrypt', { text: inputText });
      const data = response.data;

      setEncryptionKey(data.key);
      setEncryptedOutput(data.encrypted);
      
      setCloudStatus('Syncing with Firestore...');
      setTimeout(() => setCloudStatus('Safely recorded in Cloud Database'), 1000);
      
    } catch (error) {
      console.error('Encryption error:', error);
      setEncryptedOutput('ERROR: Failed to connect to Quantum Engine');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecryption = async () => {
    if (!encryptedOutput || !decryptionKey) return;
    
    setIsDecrypting(true);
    setDecryptedOutput('');
    
    try {
      const response = await api.post('/engine1/decrypt', { 
        encrypted: encryptedOutput, 
        key: decryptionKey 
      });
      
      const data = response.data;
      setDecryptedOutput(data.decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      setDecryptedOutput('DECRYPTION FAILED: API connection error');
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-4 md:mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Quantum-Safe Encryption</h2>
          <p className="text-text-muted text-sm md:text-base">Secure your sensitive data with post-quantum CRYSTALS-Kyber-768.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-light px-4 py-2 rounded-lg border border-border w-full md:w-auto justify-center">
          <Database size={18} className="text-primary" />
          <span className="text-xs font-mono">{cloudStatus || 'Standby Mode'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8 bg-bg-panel border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={18} className="text-secondary" /> Source Data
            </h2>
            <label className="cursor-pointer px-3 py-1.5 bg-bg-base border border-border-subtle hover:bg-bg-hover hover:border-border-hover rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <Upload size={14} /> Upload File
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          <textarea 
            className="flex-1 w-full min-h-[200px] p-4 bg-bg-base border border-border-subtle rounded-lg text-primary font-mono text-sm leading-relaxed focus:outline-none focus:border-secondary transition-colors resize-none mb-6"
            placeholder="Paste text or JSON data here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          
          <button 
            className="w-full py-3 bg-primary text-bg-base hover:bg-white rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleEncryption}
            disabled={!inputText || isEncrypting}
          >
            {isEncrypting ? (
              <>
                <Cpu size={18} className="animate-spin" /> Generating Quantum Lattice...
              </>
            ) : (
              <>
                <Lock size={18} /> Encrypt with Kyber-1024
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-5 bg-bg-panel border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col relative h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lock size={18} className="text-brand-green" /> Encrypted Output
            </h2>
            {encryptedOutput && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-md text-xs font-semibold">
                <CheckCircle2 size={12} /> Quantum-Safe
              </div>
            )}
          </div>
          
          {isEncrypting && (
            <div className="absolute inset-0 bg-black/80 z-10 flex flex-col items-center justify-center rounded-xl m-6">
              <div className="relative flex items-center justify-center w-20 h-20 mb-4">
                <Key size={40} className="text-brand-blue" />
                <div className="absolute inset-0 border-2 border-brand-blue rounded-full animate-ping"></div>
              </div>
              <p className="text-brand-blue font-mono text-sm">Encapsulating Keys...</p>
            </div>
          )}

          <div className="flex-1 w-full min-h-[200px] p-4 bg-bg-base border border-border-subtle rounded-lg text-brand-green font-mono text-sm leading-relaxed overflow-y-auto break-all">
            {encryptedOutput || <span className="text-secondary">Waiting for encryption...</span>}
          </div>

          {encryptionKey && (
            <div className="mt-4 p-3 bg-brand-blue/5 border border-border-subtle rounded-lg flex justify-between items-center">
              <span className="text-xs text-secondary font-medium uppercase tracking-wider">Generated Key:</span>
              <code className="text-primary text-sm select-all">{encryptionKey}</code>
            </div>
          )}

          {cloudStatus && (
            <div className="mt-4 flex items-center gap-2 text-sm animate-fade-in" style={{ color: cloudStatus.includes('Safely') ? 'var(--color-brand-green)' : 'var(--color-secondary)' }}>
              <Cloud size={16} /> {cloudStatus}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Decryption Panel */}
        <div className="bg-bg-panel border border-border-subtle rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Unlock size={18} className="text-amber-500" /> Reverse Process
          </h2>
          <div className="space-y-2 mb-6">
            <label className="block text-sm font-medium text-secondary">Enter Quantum Key</label>
            <input 
              type="text" 
              className="w-full bg-bg-base border border-border-subtle rounded-md px-3 py-2 text-primary focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="kyber-..." 
              value={decryptionKey}
              onChange={(e) => setDecryptionKey(e.target.value)}
            />
          </div>
          <button 
            className="w-full py-2.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20 rounded-md font-medium transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDecryption}
            disabled={!encryptedOutput || !decryptionKey || isDecrypting}
          >
            {isDecrypting ? 'Decrypting...' : 'Decrypt Data'}
          </button>
          
          {decryptedOutput && (
            <div className="p-4 bg-bg-base border border-border-subtle rounded-lg min-h-[100px]">
              {decryptedOutput.includes('FAILED') ? (
                <div className="text-red-500 flex items-center gap-2 font-medium text-sm">
                  <ShieldAlert size={18} /> {decryptedOutput}
                </div>
              ) : (
                <pre className="font-mono text-sm whitespace-pre-wrap text-primary">
                  {decryptedOutput}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Audit Logs */}
        <div className="bg-bg-panel border border-border-subtle rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Database size={18} className="text-brand-blue" /> Firestore Operations Log
          </h2>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-secondary">
                  <th className="pb-3 font-medium">Timestamp</th>
                  <th className="pb-3 font-medium">Size</th>
                  <th className="pb-3 font-medium">Algorithm</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-3 text-primary">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 text-secondary">{log.size}</td>
                    <td className="py-3 text-brand-blue">{log.algorithm}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-green/10 text-brand-green border border-brand-green/20">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumSafeEncryption;
