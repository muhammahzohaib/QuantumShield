import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Lock, 
  Activity, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  FileText,
  ShieldAlert,
  Zap
} from 'lucide-react';
import GlowCard from '../components/ui/GlowCard';
import GlowButton from '../components/ui/GlowButton';
import StatusBadge from '../components/ui/StatusBadge';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import './Dashboard.css';

const Dashboard = () => {
  const [recentActivity, setRecentActivity] = React.useState([]);

  React.useEffect(() => {
    const q = query(
      collection(db, 'activities'), 
      orderBy('timestamp', 'desc'), 
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });
      setRecentActivity(activities);
    });

    return () => unsubscribe();
  }, []);

  const stats = [
    { label: 'Files Encrypted', value: '1,284', trend: '+12%', up: true },
    { label: 'Noise Operations', value: '852', trend: '+5%', up: true },
    { label: 'Shields Applied', value: '3,410', trend: '-2%', up: false },
    { label: 'API Calls', value: '12.5k', trend: '+18%', up: true },
  ];

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="dashboard-container"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <header className="dashboard-header">
        <div>
          <h1 className="welcome-text">Welcome back, Muhammad</h1>
          <p className="current-date">{today}</p>
        </div>
        <GlowButton variant="accent">
          <Zap size={18} /> Upgrade Plan
        </GlowButton>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <GlowCard>
              <div className="stat-card-content">
                <div className="stat-header">
                  {stat.label}
                  {stat.up ? <TrendingUp size={16} className="trend-up" /> : <TrendingDown size={16} className="trend-down" />}
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-trend ${stat.up ? 'trend-up' : 'trend-down'}`}>
                  {stat.trend} <span className="text-muted font-normal">since last month</span>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div className="activity-section" variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="table-wrapper">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Engine</th>
                <th className="hide-on-mobile-table">File Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity) => (
                <tr key={activity.id}>
                  <td>{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    <div className="engine-tag">
                      {activity.engine === 'Engine 1' && <Lock size={14} />}
                      {activity.engine === 'Engine 2' && <Activity size={14} />}
                      {activity.engine === 'Engine 3' && <EyeOff size={14} />}
                      <span className="hide-on-mobile-table">{activity.engine}</span>
                    </div>
                  </td>
                  <td className="text-primary font-medium hide-on-mobile-table">{activity.fileName}</td>
                  <td>
                    <StatusBadge 
                      label={activity.status} 
                      variant={
                        activity.status === 'Success' ? 'accent' : 
                        activity.status === 'Warning' ? 'primary' : 'danger'
                      } 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {[
          { name: 'Encrypt File', icon: <Lock size={20} />, engine: 'Engine 1' },
          { name: 'Inject Noise', icon: <Activity size={20} />, engine: 'Engine 2' },
          { name: 'Shield Text', icon: <EyeOff size={20} />, engine: 'Engine 3' },
          { name: 'Media Privacy', icon: <ShieldCheck size={20} />, engine: 'Media' },
        ].map((action, i) => (
          <motion.div key={i} variants={itemVariants} style={{ flex: 1 }}>
            <GlowCard className="quick-action-card">
              <div className="action-icon">{action.icon}</div>
              <div className="text-sm font-bold">{action.name}</div>
              <div className="text-xs text-muted">{action.engine}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Dashboard;
