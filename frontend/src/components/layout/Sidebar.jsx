import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Lock, 
  Activity, 
  EyeOff, 
  Image, 
  Key, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Home', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Engine 1: Encryption', icon: <Lock size={20} />, path: '/engine1' },
    { name: 'Engine 2: Noise Injector', icon: <Activity size={20} />, path: '/engine2' },
    { name: 'Engine 3: AI Shield', icon: <EyeOff size={20} />, path: '/engine3' },
    { name: 'Media Studio', icon: <Image size={20} />, path: '/media' },
    { name: 'API Keys', icon: <Key size={20} />, path: '/api-keys' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <button className="hamburger-btn show-only-mobile" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay show-only-mobile" onClick={toggleSidebar} />}

      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <button className="close-sidebar-btn show-only-mobile" onClick={toggleSidebar}>
          <X size={24} />
        </button>

        <NavLink to="/" className="sidebar-logo" onClick={() => setIsOpen(false)}>
          <Shield size={32} className="text-primary" fill="rgba(14, 165, 233, 0.2)" />
          <span className="logo-text">QuantumShield</span>
        </NavLink>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar-placeholder">MZ</div>
            <div className="user-info">
              <span className="user-name">Muhammad</span>
              <span className="user-role">System Admin</span>
            </div>
          </div>
          <button className="logout-btn">
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
