import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Mail, Lock } from 'lucide-react';

const AuthScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('mode') === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate auth and redirect
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-bg-base">
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 no-underline text-primary z-10">
        <Shield size={24} className="text-brand-blue" />
        <span className="font-sans text-xl font-bold tracking-tight">
          Quantum<span className="text-brand-green">Shield</span>
        </span>
      </Link>

      <div className="bg-bg-panel border border-border-subtle rounded-xl shadow-sm w-full max-w-md p-10 z-10 animate-fade-in relative overflow-hidden">
        
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-green"></div>
        
        <div className="text-center mb-8 mt-2">
          <h1 className="text-2xl font-bold mb-2 tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-secondary text-sm">
            {isLogin ? 'Enter your credentials to access the secure terminal.' : 'Deploy your first QuantumShield environment.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-secondary">Full Name</label>
              <input type="text" className="w-full bg-bg-base border border-border-subtle rounded-md px-3 py-2 text-primary focus:outline-none focus:border-secondary transition-colors" placeholder="John Doe" required />
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-secondary">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input type="email" className="w-full bg-bg-base border border-border-subtle rounded-md pl-10 pr-3 py-2 text-primary focus:outline-none focus:border-secondary transition-colors" placeholder="admin@organization.com" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-secondary">Password</label>
              {isLogin && <a href="#" className="text-brand-blue text-xs hover:underline">Forgot?</a>}
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input type="password" className="w-full bg-bg-base border border-border-subtle rounded-md pl-10 pr-3 py-2 text-primary focus:outline-none focus:border-secondary transition-colors" placeholder="••••••••" required />
            </div>
          </div>

          <button type="submit" className="w-full py-2.5 flex items-center justify-center gap-2 bg-primary text-bg-base hover:bg-white rounded-md font-medium transition-colors mt-6">
            {isLogin ? 'Authenticate' : 'Initialize Account'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="relative text-center my-8">
          <hr className="border-border-subtle" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-panel px-4 text-secondary text-xs font-medium tracking-wide">
            OR CONTINUE WITH
          </span>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 py-2 bg-bg-base border border-border-subtle hover:bg-bg-hover rounded-md text-sm font-medium transition-colors">
            GitHub
          </button>
          <button className="flex-1 py-2 bg-bg-base border border-border-subtle hover:bg-bg-hover rounded-md text-sm font-medium transition-colors">
            Google Cloud
          </button>
        </div>

        <p className="text-center mt-8 text-secondary text-sm">
          {isLogin ? "Don't have an access key? " : "Already initialized? "}
          <Link to={isLogin ? '/auth?mode=signup' : '/auth?mode=login'} className="text-primary font-semibold hover:underline">
            {isLogin ? 'Request Access' : 'Authenticate'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
