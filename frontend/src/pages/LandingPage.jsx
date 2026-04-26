import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, EyeOff, Server, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pt-24 bg-bg-base text-primary min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs md:text-sm font-semibold mb-6 md:mb-8 animate-fade-in">
            <Zap size={16} /> Google AI Competition 2025
          </div>
          
          <h1 className="mb-6 animate-fade-in">
            Your Data Has Never Been <br />
            <span className="gradient-text-animated">This Protected</span>
          </h1>
          
          <p className="text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
            Quantum encryption. Differential privacy. 
            Anti-AI scraping. One platform. Built for the future of data sovereignty.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link to="/auth?mode=signup" className="w-full sm:w-auto px-8 py-3 text-bg-base bg-primary hover:bg-white rounded-md font-medium transition-all flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link to="#features" className="w-full sm:w-auto px-8 py-3 text-primary bg-bg-panel border border-border-subtle hover:bg-bg-hover hover:border-border-hover rounded-md font-medium transition-all">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-bg-panel border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Three Engines. <span className="text-brand-blue">Infinite Protection.</span></h2>
            <p className="text-secondary max-w-2xl mx-auto text-lg">
              Our platform architecture is built on three core security engines operating in perfect synchronization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock size={28} className="text-brand-blue" />,
                title: 'Data Encryption Engine',
                desc: 'Post-quantum cryptographic algorithms ensuring your data remains unreadable even to future quantum computers.'
              },
              {
                icon: <Server size={28} className="text-brand-green" />,
                title: 'Diff. Privacy Injector',
                desc: 'Automated Laplacian noise injection to guarantee individual record privacy while maintaining dataset utility.'
              },
              {
                icon: <Shield size={28} className="text-brand-blue" />,
                title: 'Anti-AI Scraping Shield',
                desc: 'Adversarial text perturbations and ZWSP tokens rendering your data toxic to unauthorized AI scrapers.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-bg-card border border-border-subtle p-8 rounded-xl shadow-sm hover:border-border-hover transition-colors">
                <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Privacy Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-semibold mb-6 uppercase tracking-wider">
                New Module
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-6">Media Privacy Studio</h2>
              <p className="text-secondary text-lg leading-relaxed mb-8">
                Automatically detect and anonymize faces, license plates, and sensitive documents in video streams and images before they ever reach your Firebase storage.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  'Real-time PII redaction for video streams',
                  'Automated compliance reporting (GDPR/CCPA)',
                  'Custom adversarial object recognition models'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-brand-green flex-shrink-0" />
                    <span className="text-primary">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/auth?mode=signup" className="inline-block px-6 py-3 text-bg-base bg-brand-blue hover:bg-brand-blue-hover rounded-md font-medium transition-all">
                Explore Media Studio
              </Link>
            </div>
            
            <div className="flex-1 w-full">
              <div className="bg-bg-panel border border-border-subtle p-4 rounded-xl shadow-sm relative">
                <div className="aspect-video bg-bg-base rounded-lg border border-border-hover overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="w-64 h-64 border border-brand-green rounded-full animate-ping"></div>
                  </div>
                  <EyeOff size={48} className="text-brand-green opacity-50 relative z-10" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between z-10">
                    <span className="text-brand-green text-xs font-mono tracking-wider bg-black/50 px-2 py-1 rounded">ANALYSIS: SECURE</span>
                    <span className="text-secondary text-xs font-mono tracking-wider bg-black/50 px-2 py-1 rounded">LIVE / 1080p</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-bg-panel border-t border-border-subtle">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Ready to secure your infrastructure?</h2>
          <p className="text-secondary mb-10 text-lg">Join the next generation of privacy-first organizations.</p>
          <Link to="/auth" className="inline-block px-8 py-3 text-bg-base bg-primary hover:bg-white rounded-md font-medium transition-all">
            Access Dashboard
          </Link>
          
          <div className="mt-16 text-sm text-secondary">
            &copy; 2026 QuantumShield Platform. Built for the AISehako Competition by <span className="text-primary font-semibold">Muhammad Zohaib</span>.
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
