import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

// Layouts
import DashboardLayout from './pages/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const VerifyPhone = lazy(() => import('./pages/auth/VerifyPhone'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Engine1 = lazy(() => import('./pages/Engine1'));

// Loading Fallback
const LoadingScreen = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050914] z-50">
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Shield size={64} className="text-primary" />
    </motion.div>
    <p className="mt-4 text-primary font-bold tracking-widest uppercase text-xs">Initializing Quantum Shield...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-phone" element={<VerifyPhone />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="engine1" element={<Engine1 />} />
            {/* Add more engine routes as they are built */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
