import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Lock, Activity, EyeOff } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="mobile-nav show-only-mobile">
      <NavLink to="/dashboard" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={22} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/engine1" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Lock size={22} />
        <span>Lock</span>
      </NavLink>
      <NavLink to="/engine2" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Activity size={22} />
        <span>Activity</span>
      </NavLink>
      <NavLink to="/engine3" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <EyeOff size={22} />
        <span>Shield</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
