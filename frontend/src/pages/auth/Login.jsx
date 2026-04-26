import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendSignInLinkToEmail, 
  signInWithPhoneNumber, 
  RecaptchaVerifier 
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import GlowCard from '../../components/ui/GlowCard';
import GlowButton from '../../components/ui/GlowButton';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [logs, setLogs] = useState([
    '[00:01] Initializing QuantumShield Secure Tunnel...',
    '[00:02] Establishing CRYSTALS-Kyber Handshake...'
  ]);

  const recaptchaRef = useRef(null);

  // Terminal Logs Animation
  useEffect(() => {
    const possibleLogs = [
      '[00:01] Encrypting user_data.csv with CRYSTALS-Kyber...',
      '[00:02] Noise injected. Epsilon: 0.3',
      '[00:03] Anti-scrape shield applied. Score: 94/100',
      '[00:04] Integrity hash: a3f9-2b88-c7e1-d821',
      '[00:05] Quantum Key generated: kyber_1024_auth',
      '[00:06] Monitoring adversarial scraping attempts...',
      '[00:07] Differential privacy budget: 85% remaining'
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      setLogs(prev => {
        const nextLog = possibleLogs[index % possibleLogs.length];
        index++;
        return [...prev.slice(-4), nextLog];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleSendEmailLink = async () => {
    if (!email) return;
    const actionCodeSettings = {
      url: window.location.origin + '/finish-login',
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
      setMessage({ type: 'success', text: 'Check your email for the magic link' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) return;
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setMessage({ type: 'success', text: 'SMS code sent successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    try {
      await confirmationResult.confirm(code);
      navigate('/dashboard');
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid verification code' });
    }
  };

  return (
    <div className="login-page flex-col md:flex-row">
      <div id="recaptcha-container"></div>
      
      {/* Left Panel - Hidden on mobile */}
      <div className="left-panel hidden md:flex">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="login-title">Protect Your Data</p>
          <h1 className="login-heading">
            Your Identity Has Never Been <br />
            <span className="gradient-text-animated">This Protected</span>
          </h1>

          <div className="feature-pills flex-wrap">
            <span className="feature-pill">🔐 Quantum Encryption</span>
            <span className="feature-pill">🔒 Differential Privacy</span>
            <span className="feature-pill">🛡️ Anti-AI Shield</span>
          </div>

          <div className="mock-terminal">
            {logs.map((log, i) => (
              <div key={i} className="terminal-line">
                <span className="text-primary-glow">&gt;</span> {log}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Full width on mobile */}
      <div className="right-panel w-full md:w-[40%] !px-4 md:!px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center"
        >
          <GlowCard className="login-card w-full !p-6 md:!p-10">
            <div className="flex flex-col items-center mb-8">
              <Shield size={48} className="text-primary mb-4" />
              <h2 className="text-2xl font-bold">Welcome Back</h2>
              <p className="text-text-muted text-sm text-center">Sign in to your secure workspace</p>
            </div>

            <button className="google-auth-btn" onClick={handleGoogleSignIn}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" width="20" />
              Continue with Google
            </button>

            <div className="divider">or</div>

            {authMode === 'email' ? (
              <div className="auth-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <GlowButton variant="accent" onClick={handleSendEmailLink}>
                  Send OTP Code
                </GlowButton>
              </div>
            ) : (
              <div className="auth-form">
                {!confirmationResult ? (
                  <>
                    <input 
                      type="tel" 
                      placeholder="+92 300 0000000" 
                      className="auth-input"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <GlowButton variant="accent" onClick={handleSendOTP}>
                      Send SMS Code
                    </GlowButton>
                  </>
                ) : (
                  <>
                    <div className="otp-grid">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength="1"
                          className="otp-box !w-full !h-[48px]"
                          value={digit}
                          onChange={(e) => {
                            const newOtp = [...otp];
                            newOtp[i] = e.target.value;
                            setOtp(newOtp);
                            if (e.target.value && i < 5) {
                              e.target.nextSibling?.focus();
                            }
                          }}
                        />
                      ))}
                    </div>
                    <GlowButton variant="primary" onClick={handleVerifyOTP}>
                      Verify Code
                    </GlowButton>
                  </>
                )}
              </div>
            )}

            {message.text && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                message.type === 'error' ? 'bg-danger/10 text-danger' : 'bg-accent/10 text-accent'
              }`}>
                {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                {message.text}
              </div>
            )}

            <button 
              className="toggle-link"
              onClick={() => {
                setAuthMode(authMode === 'email' ? 'phone' : 'email');
                setConfirmationResult(null);
                setMessage({ type: '', text: '' });
              }}
            >
              {authMode === 'email' ? 'Use phone number instead' : 'Use email instead'}
            </button>
          </GlowCard>
        </motion.div>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="footer-link">Register</Link></p>
          <p className="mt-4 text-xs opacity-50">
            By signing in you agree to our <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
