import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, Database, Lock, Server, Video, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} />, exact: true },
    { path: '/dashboard/pipeline', label: 'Unified Pipeline', icon: <Lock size={20} /> },
    { path: '/dashboard/engine-1', label: 'Data Encryption', icon: <Lock size={20} /> },
    { path: '/dashboard/engine-2', label: 'Diff. Privacy', icon: <Server size={20} /> },
    { path: '/dashboard/engine-3', label: 'Anti-AI Shield', icon: <Database size={20} /> },
    { path: '/dashboard/media-privacy', label: 'Media Privacy Studio', icon: <Video size={20} /> },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-bg-panel border-r border-border-subtle flex flex-col z-50">
      <div className="px-6 py-6 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Shield size={24} className="text-brand-blue" />
          <span className="font-sans text-xl font-bold tracking-tight text-primary">
            Quantum<span className="text-brand-green">Shield</span>
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        <p className="text-xs uppercase text-secondary font-semibold tracking-wider mb-2 px-2">
          Modules
        </p>
        
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            end={item.exact}
            className={({ isActive }) => \`
              flex items-center gap-3 px-4 py-2.5 rounded-md no-underline transition-all duration-200
              \${isActive 
                ? 'bg-bg-hover text-primary border-l-2 border-brand-blue font-semibold shadow-sm' 
                : 'text-secondary border-l-2 border-transparent hover:bg-bg-hover hover:text-primary font-medium'}
            \`}
          >
            <span className="opacity-80">
              {item.icon}
            </span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="px-4 py-6 border-t border-border-subtle">
        <NavLink 
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-md no-underline transition-all duration-200 text-red-500 font-medium hover:bg-red-500/10"
        >
          <LogOut size={20} />
          <span className="text-sm">Log Out</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
