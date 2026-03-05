"use client";

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { animate } from 'motion';
import createGlobe from 'cobe';
import {
  Globe,
  Compass,
  HardHat,
  LineChart,
  Shield,
  Lock,
  FileText,
  Linkedin,
  Github,
  Mail,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

// Helper component for animated counters
const AnimatedCounter = ({ to, title, suffix = '+', duration = 2 }: { to: number, title: string, suffix?: string, duration?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isInView) {
        setIsInView(true);
      }
    }, { threshold: 0.1 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration, ease: 'easeOut' });
      return controls.stop;
    }
  }, [isInView, count, to, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-display font-bold text-gold-400">
        <motion.span>{rounded}</motion.span>
        <span>{suffix}</span>
      </div>
      <p className="text-sm md:text-base font-sans text-white/70 mt-2">{title}</p>
    </div>
  );
};

const StaticStat = ({ value, title }: { value: string, title: string }) => {
    return (
        <div className="text-center">
            <p className="text-4xl md:text-5xl font-display font-bold text-gold-400">{value}</p>
            <p className="text-sm md:text-base font-sans text-white/70 mt-2">{title}</p>
        </div>
    );
}

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stars = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
    id: `star-${i}`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 2}px`,
    animationDuration: `${2 + Math.random() * 3}s`,
    animationDelay: `${Math.random() * 5}s`,
  })), []);

  const dust = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: `dust-${i}`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 2}px`,
    animationDuration: `${10 + Math.random() * 10}s`,
    animationDelay: `${Math.random() * 20}s`,
  })), []);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener('resize', onResize);
    onResize();
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.15, 0.15, 0.15],
      markerColor: [0.83, 0.68, 0.21], // #D4AF37
      glowColor: [0.1, 0.1, 0.1],
      markers: [
        { location: [-4.0383, 21.7587], size: 0.1 },
        { location: [4.325, 15.3222], size: 0.05 },
        { location: [-11.6667, 27.4833], size: 0.05 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
        state.width = width * 2;
        state.height = width * 2;
      }
    });
    setTimeout(() => onResize());

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);
  
  const smoothScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-bg-dark text-white font-sans scroll-smooth">
      {/* --- Navigation --- */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-surface/50 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="text-2xl font-display font-bold text-white">VG♦</div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/mining" className="hover:text-gold-400 transition-colors">Mining Offers</a>
              <a onClick={() => smoothScroll('features')} className="cursor-pointer hover:text-gold-400 transition-colors">Features</a>
              <a href="/about" className="hover:text-gold-400 transition-colors">About</a>
              <a href="#contact" onClick={(e) => {e.preventDefault(); smoothScroll('footer');}} className="cursor-pointer hover:text-gold-400 transition-colors">Contact</a>
            </div>
            <button onClick={onEnter} className="bg-gold-400 text-bg-dark font-bold py-2 px-6 rounded-md hover:bg-gold-300 transition-all duration-300 transform hover:scale-105">
              Enter Platform
            </button>
          </div>
        </div>
      </motion.nav>

      {/* --- Hero Section --- */}
      <header className="relative h-screen flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          {/* Stars */}
          {stars.map(s => (
            <div key={s.id} className="absolute rounded-full" style={{
              left: s.left, top: s.top, width: s.size, height: s.size,
              background: 'rgba(212,175,55,0.6)',
              boxShadow: '0 0 6px rgba(212,175,55,0.8), 0 0 12px rgba(212,175,55,0.4)',
              animation: `star-twinkle ${s.animationDuration} ${s.animationDelay} infinite alternate ease-in-out`,
            }}/>
          ))}
          {/* Floating dust */}
          {dust.map(d => (
            <div key={d.id} className="absolute rounded-full" style={{
              left: d.left, width: d.size, height: d.size,
              background: 'rgba(212,175,55,0.5)',
              boxShadow: '0 0 8px rgba(212,175,55,0.6)',
              animation: `float-up ${d.animationDuration} ${d.animationDelay} infinite linear`,
            }}/>
          ))}
          {/* Sonic wave rings */}
          <div className="sonic-waves-container">
            <div className="sonic-wave" />
            <div className="sonic-wave" />
            <div className="sonic-wave" />
            <div className="sonic-wave" />
          </div>
          {/* Ambient gold glow */}
          <div className="ambient-energy" />
        </div>

        {/* Globe — positioned right, large & immersive */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[15%] pointer-events-none"
        >
          <div className="relative">
            <canvas ref={canvasRef} style={{ width: '900px', height: '900px', maxWidth: '55vw', aspectRatio: '1' }} />
            {/* Gold glow aura behind globe */}
            <div className="absolute inset-0 rounded-full" style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 40%, transparent 65%)',
              transform: 'scale(1.6)',
            }} />
          </div>
        </motion.div>

        {/* Hero content — left aligned */}
        <div className="relative z-10 w-full lg:w-[55%] h-full flex flex-col justify-center px-8 lg:px-16">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <span className="inline-flex items-center gap-2 premium-glass rounded-full px-5 py-2 text-sm text-gold-400 font-mono mb-8 border border-gold-400/20">
              <Sparkles size={14} className="text-gold-400" />
              Trusted by Mining Professionals Worldwide
            </span>
          </motion.div>

          {/* Logo badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-5 mb-6"
          >
            <div className="w-16 h-16 relative flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 border border-gold-400/50 rotate-45 gold-glow bg-gold-400/5 group-hover:rotate-90 transition-transform duration-700"></div>
              <div className="absolute inset-2 border border-gold-400/20 rotate-45 group-hover:-rotate-45 transition-transform duration-700"></div>
              <span className="text-gold-400 font-display font-bold text-2xl tracking-tighter relative z-10 icon-shine gold-text-alive">VG</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gold-400 uppercase tracking-[0.4em] text-sm font-display font-semibold icon-shine">
                Executive Intelligence
              </span>
              <span className="text-gray-600 text-xs uppercase tracking-widest font-mono">
                Classified Platform
              </span>
            </div>
          </motion.div>

          {/* Hero title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-6xl md:text-8xl font-display font-light tracking-widest text-white mb-6 leading-none uppercase"
          >
            Visio<span className="font-bold bg-gradient-to-r from-gold-300 via-gold-400 to-gold-200 bg-clip-text text-transparent">Gold</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg text-white/70 mb-10 max-w-xl leading-relaxed font-medium"
          >
            The premier AI-powered mining intelligence platform for the Democratic Republic of the Congo.
            Real-time geological intelligence, opportunity scoring, project planning, and Monte Carlo simulation — all in one immersive command center.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex items-center gap-5 flex-wrap mb-10"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212,175,55,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnter}
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-gold-400 to-gold-500 text-bg-dark font-display font-bold uppercase tracking-widest text-sm shadow-gold-md hover:from-gold-300 hover:to-gold-400 transition-all duration-300"
            >
              <Zap size={18} className="relative z-10" />
              <span className="relative z-10">Enter Platform</span>
              <ArrowRight strokeWidth={1.5} size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
            </motion.button>

            <button
              onClick={() => smoothScroll('features')}
              className="inline-flex items-center gap-3 px-10 py-4 border border-gold-400/40 text-gold-400 font-display font-bold uppercase tracking-widest text-sm hover:bg-gold-400/10 hover:border-gold-400/60 transition-all duration-300"
            >
              Learn More
            </button>
          </motion.div>

          {/* Security badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex items-center gap-2 text-gray-600 text-xs"
          >
            <Shield size={14} className="text-gold-400/50" />
            <span className="font-mono uppercase tracking-wider">Secure • Encrypted • Private</span>
          </motion.div>
        </div>

        {/* Bottom status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-center"
        >
          <div className="flex gap-8">
            <span className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-mono">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              Satellites Linked
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-mono">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]"></span>
              AI Core Active
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
              GIS Layers Ready
            </span>
          </div>
          <div className="text-xs text-gray-600 font-mono uppercase tracking-wider">
            v3.0 • DRC Mining Intelligence
          </div>
        </motion.div>
      </header>

      {/* --- Features Section --- */}
      <section id="features" className="py-24 bg-bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-2">Intelligence at Every Stage</h2>
            <div className="w-24 h-1 bg-gold-400 mx-auto mb-12"></div>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: "Geospatial Intelligence", desc: "Interactive 3D mapping of DRC concessions, geology & infrastructure." },
              { icon: Compass, title: "Opportunity Scoring", desc: "AI-scored opportunities ranked by geological potential & risk profiles." },
              { icon: HardHat, title: "Project Builder", desc: "Generate project plans, timelines, compliance checklists & risk registers." },
              { icon: LineChart, title: "Monte Carlo Simulation", desc: "Deterministic cost modeling with scenario analysis & 12-department breakdowns." },
            ].map((feature, i) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-gold-md"
              >
                <div className="mb-4">
                  <feature.icon className="w-10 h-10 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold font-display mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section className="py-20 bg-bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter to={500} title="Concessions Mapped" />
            <AnimatedCounter to={12} title="Simulation Departments" suffix="" />
            <StaticStat value="256-bit" title="Encryption" />
            <StaticStat value="99.9%" title="Uptime" />
          </div>
        </div>
      </section>

      {/* --- Technology Section --- */}
      <section className="py-24 bg-bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">Built for Enterprise Security</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, title: "Row-Level Security", desc: "Data access is strictly controlled, ensuring users only see what they are permitted to." },
              { icon: Lock, title: "Envelope Encryption", desc: "Your sensitive data is protected at rest with multiple layers of industry-standard encryption." },
              { icon: FileText, title: "Audit Logging", desc: "Every critical action is logged for compliance, security reviews, and full traceability." },
            ].map((tech, i) => (
              <motion.div 
                key={tech.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                viewport={{ once: true }}
                className="bg-black/20 p-8 rounded-lg border border-white/10"
              >
                <div className="inline-block p-4 bg-bg-dark rounded-full mb-4">
                  <tech.icon className="w-8 h-8 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold font-display mb-2">{tech.title}</h3>
                <p className="text-white/70">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="relative py-24 bg-bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gold-500/10 to-transparent to-70%"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-bold mb-4"
          >
            Ready to Discover Gold?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
            className="text-lg text-white/80 mb-8"
          >
            Start your intelligence journey today.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
            <button onClick={onEnter} className="bg-gold-400 text-bg-dark font-bold py-4 px-12 text-lg rounded-md hover:bg-gold-300 transition-all duration-300 transform hover:scale-105 shadow-gold-lg">
              Enter Platform
            </button>
          </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer id="footer" className="bg-bg-dark border-t border-white/5 text-white/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative flex items-center justify-center">
                  <div className="absolute inset-0 border border-gold-400/40 rotate-45 bg-gold-400/5"></div>
                  <span className="text-gold-400 font-display font-bold text-sm relative z-10">VG</span>
                </div>
                <span className="font-display font-bold text-white text-lg">VisioGold</span>
              </div>
              <p className="text-sm leading-relaxed">Built with precision for DRC mining intelligence. Enterprise-grade security meets cutting-edge AI.</p>
              <div className="flex space-x-4 pt-2">
                <a href="https://www.linkedin.com/company/visiogold" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-400/40 hover:text-gold-400 transition-all"><Linkedin size={14}/></a>
                <a href="https://github.com/Iamhamptom/VisioGoldMining" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-400/40 hover:text-gold-400 transition-all"><Github size={14}/></a>
                <a href="mailto:contact@visiogold.com" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-400/40 hover:text-gold-400 transition-all"><Mail size={14}/></a>
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" onClick={(e) => {e.preventDefault(); smoothScroll('features');}} className="cursor-pointer hover:text-gold-400 transition-colors">Features</a></li>
                <li><a href="/about" className="hover:text-gold-400 transition-colors">About Us</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); smoothScroll('footer');}} className="cursor-pointer hover:text-gold-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-gold-400 transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="mailto:contact@visiogold.com" className="hover:text-gold-400 transition-colors flex items-center gap-2"><Mail size={14}/> contact@visiogold.com</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; 2024-2025 VisioGold DRC. All Rights Reserved.</p>
            <p className="text-white/30 font-mono uppercase tracking-widest">Precision Mining Intelligence</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

