import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { sendEmailVerification } from 'firebase/auth';
import useAuth from '../../hooks/useAuth';
import GlowCard from '../../components/ui/GlowCard';
import GlowButton from '../../components/ui/GlowButton';
import './Login.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Auto-check email verification status every 3 seconds
    const checkInterval = setInterval(async () => {
      await currentUser.reload();
      if (currentUser.emailVerified) {
        clearInterval(checkInterval);
        navigate('/dashboard');
      }
    }, 3000);

    return () => clearInterval(checkInterval);
  }, [currentUser, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    try {
      await sendEmailVerification(currentUser);
      setTimer(60);
      setCanResend(false);
      setMessage('Verification email resent!');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error resending email:', error.message);
    }
  };

  return (
    <div className="login-page items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full px-4"
      >
        <GlowCard className="p-10 text-center flex flex-col items-center gap-6">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20"
          >
            <Mail size={40} />
          </motion.div>

          <div>
            <h2 className="text-3xl font-bold mb-2">Check Your Email</h2>
            <p className="text-text-muted">
              We sent a verification link to <br />
              <span className="text-primary font-medium">{currentUser?.email}</span>
            </p>
            <p className="mt-4 text-sm">
              Click the link in your inbox to activate your account. 
              If you don't see it, check your spam folder.
            </p>
          </div>

          <div className="w-full space-y-4">
            <GlowButton 
              variant={canResend ? "primary" : "ghost"} 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleResend}
              disabled={!canResend}
            >
              <RefreshCw size={18} className={!canResend ? 'opacity-50' : ''} />
              {canResend ? "Resend Email" : `Resend in ${timer}s`}
            </GlowButton>

            {message && (
              <div className="text-accent text-sm flex items-center justify-center gap-2">
                <CheckCircle size={16} /> {message}
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('/register')}
            className="text-text-muted hover:text-primary flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Change Email
          </button>
        </GlowCard>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
