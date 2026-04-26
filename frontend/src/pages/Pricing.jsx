import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Shield, Zap, Building2, ArrowRight } from 'lucide-react';

const Pricing = () => {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Transparent Pricing for <br/><span className="text-gradient-blue">Absolute Privacy</span></h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem', lineHeight: 1.6 }}>
          Choose the protection tier that fits your organization's needs. Scale securely with post-quantum cryptography.
        </p>
      </div>

      <div className="container grid-3" style={{ alignItems: 'center' }}>
        {/* Free Tier */}
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            <Shield size={20} />
            <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Free Sandbox</span>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'Outfit' }}>
            $0<span style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', minHeight: '48px' }}>Perfect for individuals and developers testing the pipeline.</p>
          
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, marginBottom: '2.5rem' }}>
            {[
              '100 API Calls / month',
              'Basic Kyber-512 Encryption',
              'Diff. Privacy (Epsilon > 5.0)',
              'Community Support'
            ].map((feature, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem' }}>
                <CheckCircle2 size={18} color="var(--text-secondary)" />
                <span style={{ color: 'var(--text-primary)' }}>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Link to="/auth?mode=signup" className="btn btn-secondary" style={{ width: '100%' }}>
            Start for Free
          </Link>
        </div>

        {/* Pro Tier (Highlighted) */}
        <div className="glass-panel" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', height: '105%', border: '1px solid var(--accent-electric-blue)', boxShadow: 'var(--shadow-md)', transform: 'scale(1.05)', zIndex: 10 }}>
          <div className="badge badge-blue" style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>
            MOST POPULAR
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-electric-blue)', marginBottom: '1rem' }}>
            <Zap size={20} />
            <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Pro Shield</span>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'Outfit' }}>
            $99<span style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', minHeight: '48px' }}>For startups and teams building privacy-first applications.</p>
          
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, marginBottom: '2.5rem' }}>
            {[
              '10,000 API Calls / month',
              'Full Kyber-1024 Encryption',
              'Full Epsilon Range (0.1 - 10)',
              'Anti-AI Web Wrapper',
              'Email Support'
            ].map((feature, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem' }}>
                <CheckCircle2 size={18} color="var(--accent-electric-blue)" />
                <span style={{ color: 'var(--text-primary)' }}>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Link to="/auth?mode=signup" className="btn btn-primary" style={{ width: '100%' }}>
            Get Started <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </Link>
        </div>

        {/* Enterprise Tier */}
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-neon-green)', marginBottom: '1rem' }}>
            <Building2 size={20} />
            <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Enterprise</span>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'Outfit' }}>
            Custom
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', minHeight: '48px' }}>Dedicated infrastructure for large-scale data operations.</p>
          
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, marginBottom: '2.5rem' }}>
            {[
              'Unlimited API Operations',
              'Custom BigQuery Integration',
              'Media Privacy Studio API',
              'Dedicated Server IPs',
              '24/7 SLA Support'
            ].map((feature, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem' }}>
                <CheckCircle2 size={18} color="var(--accent-neon-green)" />
                <span style={{ color: 'var(--text-primary)' }}>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Link to="/auth?mode=signup" className="btn btn-accent" style={{ width: '100%' }}>
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
