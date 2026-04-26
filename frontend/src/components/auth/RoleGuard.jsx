import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Zap } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import GlowCard from '../ui/GlowCard';
import GlowButton from '../ui/GlowButton';

const ROLES = {
  free: 1,
  pro: 2,
  enterprise: 3
};

const RoleGuard = ({ children, requiredRole }) => {
  const { userRole } = useAuth();

  const userLevel = ROLES[userRole] || 1;
  const requiredLevel = ROLES[requiredRole] || 1;

  if (userLevel < requiredLevel) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <GlowCard className="max-w-md w-full text-center p-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center text-danger border border-danger/20">
            <Lock size={32} />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-2">Access Restricted</h3>
            <p className="text-text-muted">
              This feature requires a <span className="text-primary font-bold capitalize">{requiredRole}</span> plan or higher. 
              Upgrade your workspace to unlock advanced security engines.
            </p>
          </div>

          <Link to="/pricing" className="w-full">
            <GlowButton variant="primary" className="w-full flex items-center justify-center gap-2">
              <Zap size={18} /> Upgrade Now
            </GlowButton>
          </Link>
          
          <p className="text-xs text-text-muted">
            Current plan: <span className="capitalize">{userRole}</span>
          </p>
        </GlowCard>
      </div>
    );
  }

  return children;
};

export default RoleGuard;
