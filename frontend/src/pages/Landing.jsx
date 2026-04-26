import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, EyeOff, Lock, Zap, Database } from 'lucide-react';
import GlowCard from '../components/ui/GlowCard';
import GlowButton from '../components/ui/GlowButton';
import './Landing.css';

const Landing = () => {
  // Generate random particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${15 + Math.random() * 20}s`,
      size: `${2 + Math.random() * 4}px`
    }));
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="landing-container">
      {/* Background Particles */}
      <div className="particles-container">
        {particles.map(p => (
          <div 
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="competition-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Google AI Competition 2025
        </motion.div>

        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Your Data Has Never Been <br />
          <span className="gradient-text-animated">This Protected</span>
        </motion.h1>

        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Quantum encryption. Differential privacy. 
          Anti-AI scraping. One platform for the future of data security.
        </motion.p>

        <motion.div 
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <GlowButton variant="primary">Start Free Trial</GlowButton>
          <GlowButton variant="ghost">See How It Works</GlowButton>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        {...fadeInUp}
      >
        <GlowCard>
          <div className="feature-card-content">
            <div className="feature-icon">
              <Shield size={24} />
            </div>
            <h3 className="feature-card-title">Quantum-Safe Encryption</h3>
            <p className="feature-card-desc">
              Utilizing CRYSTALS-Kyber algorithms to secure your data against both classical and future quantum threats.
            </p>
          </div>
        </GlowCard>

        <GlowCard>
          <div className="feature-card-content">
            <div className="feature-icon">
              <Activity size={24} />
            </div>
            <h3 className="feature-card-title">Differential Privacy</h3>
            <p className="feature-card-desc">
              Inject mathematical noise into your datasets to extract insights without compromising individual identity.
            </p>
          </div>
        </GlowCard>

        <GlowCard>
          <div className="feature-card-content">
            <div className="feature-icon">
              <EyeOff size={24} />
            </div>
            <h3 className="feature-card-title">Anti-AI Shield</h3>
            <p className="feature-card-desc">
              Adversarial perturbations that block AI scrapers while keeping content perfectly readable for humans.
            </p>
          </div>
        </GlowCard>
      </motion.section>

      {/* Stats Bar */}
      <motion.section 
        className="stats-bar"
        {...fadeInUp}
      >
        <div className="stat-item">
          <span className="stat-number">256-bit</span>
          <span className="stat-label">Keys</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">99.8%</span>
          <span className="stat-label">Accuracy</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">3</span>
          <span className="stat-label">Engines</span>
        </div>
      </motion.section>
    </div>
  );
};

export default Landing;
