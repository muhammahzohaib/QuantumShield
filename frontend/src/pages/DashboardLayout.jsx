import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import BottomNav from '../components/layout/BottomNav';
import DemoBanner from '../components/layout/DemoBanner';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#050914] text-[#e2e8f0]">
      <DemoBanner />
      
      <div className="flex">
        {/* Responsive Sidebar - Handles its own mobile state */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 dashboard-container">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
