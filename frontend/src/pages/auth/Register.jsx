import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import GlowCard from '../../components/ui/GlowCard';
import GlowButton from '../../components/ui/GlowButton';
import './Login.css'; // Reuse Login styles

const Register = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [logs, setLogs] = useState([
    '[00:01] Initializing Registration Tunnel...',
    '[00:02] Security Verification in progress...'
  ]);

  // Terminal Logs Animation (Same as login)
  useEffect(() => {
    const possibleLogs = [
      '[00:03] Creating Secure Wallet for Quantum Keys...',
      '[00:04] Allocating Differential Privacy Budget...',
      '[00:05] Verifying Identity Signature...',
      '[00:06] Synchronizing with Global Shield Network...',
      '[00:07] Encryption Engine: READY'
    ];
    let index = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-4), possibleLogs[index % possibleLogs.length]]);
      index++;
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const validate = () => {
    let tempErrors = {};
    if (!formData.fullName) tempErrors.fullName = "Name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      tempErrors.password = "Min 8 chars, 1 uppercase, 1 number";
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const createUserProfile = async (user, displayName) => {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: displayName || user.displayName,
      role: "free",
      plan: "free",
      apiCallsUsed: 0,
      apiCallsLimit: 100,
      createdAt: serverTimestamp()
    });
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      navigate('/dashboard');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await sendEmailVerification(result.user);
      await createUserProfile(result.user, formData.fullName);
      navigate('/verify-email');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) return;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
    }
    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="login-page">
      <div id="recaptcha-container"></div>
      
      {/* Left Panel */}
      <div className="left-panel">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <p className="login-title">Join the Future of Privacy</p>
          <h1 className="login-heading">
            Secure Your Assets with <br />
            <span className="gradient-text-animated">Quantum Intelligence</span>
          </h1>
          <div className="feature-pills">
            <span className="feature-pill">🔐 Quantum Encryption</span>
            <span className="feature-pill">🛡️ Anti-AI Shield</span>
          </div>
          <div className="mock-terminal">
            {logs.map((log, i) => (
              <div key={i} className="terminal-line"><span className="text-primary-glow">&gt;</span> {log}</div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex justify-center">
          <GlowCard className="login-card">
            <div className="flex flex-col items-center mb-6">
              <Shield size={40} className="text-primary mb-2" />
              <h2 className="text-xl font-bold">Create Your Account</h2>
              <p className="text-text-muted text-xs">Start protecting your data today</p>
            </div>

            <button className="google-auth-btn" onClick={handleGoogleSignUp}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" width="18" />
              Sign up with Google
            </button>

            <div className="divider">or sign up with email</div>

            {authMode === 'email' ? (
              <form className="auth-form" onSubmit={handleEmailSignUp}>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3.5 text-text-muted" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className={`auth-input pl-10 ${errors.fullName ? 'border-danger' : ''}`}
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                  {errors.fullName && <p className="text-danger text-[10px] mt-1">{errors.fullName}</p>}
                </div>

                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-text-muted" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className={`auth-input pl-10 ${errors.email ? 'border-danger' : ''}`}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  {errors.email && <p className="text-danger text-[10px] mt-1">{errors.email}</p>}
                </div>

                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3.5 text-text-muted" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    className={`auth-input pl-10 pr-10 ${errors.password ? 'border-danger' : ''}`}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button type="button" className="absolute right-3 top-3.5 text-text-muted" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {errors.password && <p className="text-danger text-[10px] mt-1">{errors.password}</p>}
                </div>

                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3.5 text-text-muted" />
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    className={`auth-input pl-10 ${errors.confirmPassword ? 'border-danger' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                  {errors.confirmPassword && <p className="text-danger text-[10px] mt-1">{errors.confirmPassword}</p>}
                </div>

                <GlowButton variant="primary" type="submit">Create Account</GlowButton>
              </form>
            ) : (
              <div className="auth-form">
                {/* Same Phone flow as Login can be added here or toggled */}
                <input type="tel" placeholder="+92 300 0000000" className="auth-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <GlowButton variant="accent" onClick={handleSendOTP}>Send SMS Code</GlowButton>
              </div>
            )}

            {message.text && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-xs ${message.type === 'error' ? 'bg-danger/10 text-danger' : 'bg-accent/10 text-accent'}`}>
                {message.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                {message.text}
              </div>
            )}

            <button className="toggle-link" onClick={() => setAuthMode(authMode === 'email' ? 'phone' : 'email')}>
              {authMode === 'email' ? 'Sign up with phone instead' : 'Sign up with email instead'}
            </button>
          </GlowCard>
        </motion.div>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="footer-link">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
