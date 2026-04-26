import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import GlowCard from '../../components/ui/GlowCard';
import GlowButton from '../../components/ui/GlowButton';
import './Login.css';

const VerifyPhone = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    // If no confirmation result is found in window, go back to login
    if (!window.confirmationResult) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }

    // Auto-submit if all 6 filled
    if (newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = async (code) => {
    setIsVerifying(true);
    setError('');
    try {
      const result = await window.confirmationResult.confirm(code);
      const user = result.user;

      // Create Firestore profile for phone user if it doesn't exist
      await setDoc(doc(db, "users", user.uid), {
        phoneNumber: user.phoneNumber,
        role: "free",
        plan: "free",
        apiCallsUsed: 0,
        apiCallsLimit: 100,
        createdAt: serverTimestamp()
      }, { merge: true });

      navigate('/dashboard');
    } catch (err) {
      setError('Invalid code. Please try again.');
      setIsVerifying(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs[0].current.focus();
    }
  };

  return (
    <div className="login-page items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full px-4"
      >
        <GlowCard className="p-10 text-center flex flex-col items-center gap-8">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent border border-accent/20">
            <ShieldCheck size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Enter Verification Code</h2>
            <p className="text-text-muted text-sm">
              We sent a 6-digit code to your phone. <br />
              Please enter it below to verify your identity.
            </p>
          </div>

          <div className="flex gap-2 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="text"
                maxLength="1"
                className="otp-box w-12 h-14"
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && (
            <div className="text-danger text-sm flex items-center gap-2 bg-danger/10 p-3 rounded-lg w-full justify-center">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <GlowButton 
            variant="primary" 
            className="w-full"
            onClick={() => handleVerify(otp.join(''))}
            disabled={isVerifying || otp.some(d => d === '')}
          >
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </GlowButton>

          <button 
            onClick={() => navigate('/login')}
            className="text-text-muted hover:text-primary flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>
        </GlowCard>
      </motion.div>
    </div>
  );
};

export default VerifyPhone;
