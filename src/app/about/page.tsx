'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Crosshair, Shield, Rocket, Scale, Cpu, Database, Map as MapIcon, BarChart } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-surface/50 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-display font-bold text-white">VG♦</Link>
          <div className="hidden md:flex items-center space-x-8 text-sm font-sans">
            <Link href="/#features" className="hover:text-gold-400 transition-colors">Features</Link>
            <Link href="/about" className="text-gold-400 transition-colors">About</Link>
            <Link href="mailto:contact@visiogold.com" className="hover:text-gold-400 transition-colors">Contact</Link>
          </div>
          <Link href="/" className="bg-gold-400 text-bg-dark font-bold py-2 px-6 rounded-md hover:bg-gold-300 transition-all duration-300 transform hover:scale-105">
            Enter Platform
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

const Footer = () => {
  return (
    <footer id="footer" className="bg-bg-dark border-t border-white/5 text-white/50 py-16 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 relative flex items-center justify-center">
                <div className="absolute inset-0 border border-gold-400/40 rotate-45 bg-gold-400/5"></div>
                <span className="text-gold-400 font-display font-bold text-sm relative z-10">VG</span>
              </div>
              <span className="font-display font-bold text-white text-lg">VisioGold</span>
            </Link>
            <p className="text-sm leading-relaxed">Built with precision for DRC mining intelligence. Enterprise-grade security meets cutting-edge AI.</p>
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#features" className="hover:text-gold-400 transition-colors">Features</Link></li>
              <li><Link href="/about" className="hover:text-gold-400 transition-colors">About Us</Link></li>
              <li><a href="mailto:contact@visiogold.com" className="hover:text-gold-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gold-400 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="mailto:contact@visiogold.com" className="hover:text-gold-400 transition-colors flex items-center gap-2">contact@visiogold.com</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} VisioGold DRC. All Rights Reserved.</p>
          <p className="text-white/30 font-mono uppercase tracking-widest">Precision Mining Intelligence</p>
        </div>
      </div>
    </footer>
  );
};

const AboutPage = () => {
  const team = [
    { name: 'Dr. Evelyn Reed', title: 'Chief Executive Officer', initials: 'ER' },
    { name: 'Kenji Tanaka', title: 'Chief Technology Officer', initials: 'KT' },
    { name: 'Fatima Al-Jamil', title: 'Head of Operations', initials: 'FA' },
  ];

  const tech = [
    { icon: Rocket, name: 'Next.js 14', desc: 'For a performant, server-rendered frontend experience.' },
    { icon: MapIcon, name: 'MapLibre GL', desc: 'For interactive, high-performance geospatial visualizations.' },
    { icon: Database, name: 'PostgreSQL', desc: 'Secure and scalable relational database with Row-Level Security.' },
    { icon: BarChart, name: 'Monte Carlo Engines', desc: 'For robust financial and schedule risk simulations.' },
  ];

  const values = [
    { icon: Crosshair, name: 'Precision', desc: 'Delivering accurate, data-driven insights is the bedrock of our platform.' },
    { icon: Shield, name: 'Security', desc: 'We provide enterprise-grade security to protect your most sensitive data.' },
    { icon: Rocket, name: 'Innovation', desc: 'Continuously pushing the boundaries of what is possible in mining intelligence.' },
    { icon: Scale, name: 'Integrity', desc: 'Operating with transparency and upholding the highest ethical standards.' },
  ];

  return (
    <div className="bg-bg-dark text-white font-sans">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="py-24 md:py-32 text-center bg-bg-surface relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0 opacity-20">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.2),transparent_60%)]"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-bold"
            >
              About <span className="text-gold-400">VisioGold</span> DRC
            </motion.h1>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className="w-32 h-1.5 bg-gold-400 mx-auto mt-6"
            ></motion.div>
          </div>
        </motion.section>

        {/* Mission & Vision */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="premium-glass glass-panel p-8 md:p-12 border border-gold-400/20"
              >
                <h2 className="text-3xl font-display font-bold text-gold-400 mb-4">Our Mission</h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  Empowering mining professionals with AI-driven intelligence to discover, evaluate, and develop gold opportunities in the DRC with unprecedented precision and security.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="bg-bg-elevated p-8 md:p-12"
              >
                <h2 className="text-3xl font-display font-bold text-gold-400 mb-4">Our Vision</h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  To be the world's leading mining intelligence platform, transforming how professionals discover and develop mineral resources through cutting-edge technology.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 md:py-24 bg-bg-surface">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-display font-bold text-center mb-16"
                >
                    Our Core Values
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, i) => (
                        <motion.div 
                            key={value.name}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
                            viewport={{ once: true }}
                            className="text-center p-6 bg-bg-elevated rounded-lg"
                        >
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-bg-dark flex items-center justify-center">
                                    <value.icon className="w-8 h-8 text-gold-400" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-display font-bold mb-3">{value.name}</h3>
                            <p className="text-white/70">{value.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Team */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-center mb-16"
            >
              Our Leadership
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="bg-bg-surface p-8 text-center rounded-lg"
                >
                  <div className="w-24 h-24 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-4 border-2 border-gold-400/50">
                    <span className="text-3xl font-display text-gold-400">{member.initials}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display">{member.name}</h3>
                  <p className="text-gold-400">{member.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Technology */}
        <section className="py-20 md:py-24 bg-bg-surface">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-center mb-16"
            >
              Our Technology Stack
            </motion.h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {tech.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="flex items-center gap-6 p-6 bg-bg-elevated rounded-lg premium-glass"
                >
                  <div className="flex-shrink-0">
                    <item.icon className="w-10 h-10 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display">{item.name}</h3>
                    <p className="text-white/70">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
