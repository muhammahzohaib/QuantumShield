import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <nav className="sticky top-0 z-50 bg-bg-panel border-b border-border-subtle">
        <div className="px-6 py-4 flex justify-end items-center">
          <div className="flex items-center gap-6">
            <button className="p-2 rounded-full text-secondary hover:text-primary hover:bg-bg-hover transition-colors">
              <Shield size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-bg-base flex items-center justify-center font-bold">
                <User size={20} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-primary leading-tight">Admin User</p>
                <p className="text-xs text-secondary leading-tight">Security Officer</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full z-50 py-4 bg-bg-panel-solid border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline text-primary">
          <Shield size={28} className="text-brand-green" />
          <span className="font-sans text-xl font-bold tracking-tight">
            Quantum<span className="text-brand-blue">Shield</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-secondary hover:text-primary transition-colors text-sm font-medium">Home</Link>
          <Link to="#features" className="text-secondary hover:text-primary transition-colors text-sm font-medium">Features</Link>
          <Link to="/pricing" className="text-secondary hover:text-primary transition-colors text-sm font-medium">Pricing</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/auth" className="px-4 py-2 text-sm font-medium text-primary bg-bg-base border border-border-subtle hover:bg-bg-hover hover:border-border-hover rounded-md transition-all">
            Log In
          </Link>
          <Link to="/auth?mode=signup" className="px-4 py-2 text-sm font-medium text-bg-base bg-primary hover:bg-white rounded-md transition-all">
            Get Started
          </Link>
        </div>

        <button 
          className="md:hidden p-2 text-secondary hover:text-primary transition-colors rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
