import React from 'react';
import { Activity, ShieldAlert, Lock, Database } from 'lucide-react';

const DashboardHome = () => {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 text-primary">System Overview</h1>
          <p className="text-secondary text-sm">Live monitoring of QuantumShield environment</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md text-xs font-semibold tracking-wide">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          SYSTEM OPTIMAL
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Threats Blocked', value: '1.24M', icon: <ShieldAlert size={20} className="text-brand-blue" />, trend: '+12% this week', positive: true },
          { label: 'Active Encrypted Connections', value: '45,291', icon: <Lock size={20} className="text-brand-green" />, trend: 'Stable', positive: true },
          { label: 'Media Files Redacted', value: '8,429', icon: <Database size={20} className="text-brand-blue" />, trend: '+34% this week', positive: true }
        ].map((stat, i) => (
          <div key={i} className="bg-bg-panel border border-border-subtle rounded-xl p-6 shadow-sm hover:border-border-hover transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-white/5 rounded-lg">
                {stat.icon}
              </div>
              <span className={`text-xs font-medium ${stat.positive ? 'text-brand-green' : 'text-secondary'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight mb-1">{stat.value}</h3>
            <p className="text-secondary text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-bg-panel border border-border-subtle rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity size={18} className="text-secondary" />
            Network Traffic & Threat Detection
          </h2>
          <div className="h-72 w-full bg-bg-hover border-b border-border-hover relative flex items-end gap-1 rounded-sm overflow-hidden">
            {/* Mock Chart Bars */}
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} 
                className={`flex-1 rounded-t-sm opacity-80 transition-all duration-500 ${Math.random() > 0.8 ? 'bg-brand-green' : 'bg-brand-blue'}`}
                style={{ height: `${Math.random() * 60 + 10}%` }}
              ></div>
            ))}
            {/* Chart Grid Lines */}
            <div className="absolute top-1/4 left-0 right-0 h-px bg-white/5 z-0"></div>
            <div className="absolute top-2/4 left-0 right-0 h-px bg-white/5 z-0"></div>
            <div className="absolute top-3/4 left-0 right-0 h-px bg-white/5 z-0"></div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-bg-panel border border-border-subtle rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Recent Alerts</h2>
          <div className="flex flex-col gap-5">
            {[
              { type: 'warning', text: 'Anomalous login attempt blocked (IP: 192.168.1.104)', time: '2 mins ago' },
              { type: 'info', text: 'Media Module finished processing 120 video files', time: '15 mins ago' },
              { type: 'success', text: 'Database cluster encryption keys rotated', time: '1 hour ago' },
              { type: 'warning', text: 'High bandwidth usage detected on Engine-2', time: '3 hours ago' },
              { type: 'info', text: 'System backup completed successfully', time: '5 hours ago' }
            ].map((alert, i) => (
              <div key={i} className={`flex gap-4 pb-5 ${i !== 4 ? 'border-b border-border-subtle' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alert.type === 'warning' ? 'bg-amber-500' : alert.type === 'success' ? 'bg-brand-green' : 'bg-brand-blue'}`}></div>
                <div>
                  <p className="text-sm leading-snug mb-1 text-primary">{alert.text}</p>
                  <span className="text-xs text-secondary">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
