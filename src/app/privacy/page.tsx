'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Lock, Database, Shield, Cookie, Milestone } from 'lucide-react';

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
            <Link href="/about" className="hover:text-gold-400 transition-colors">About</Link>
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
              <li><Link href="/privacy" className="text-gold-400 transition-colors">Privacy Policy</Link></li>
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


const PrivacyPage = () => {
  return (
    <div className="bg-bg-dark text-white font-sans">
      <Navbar />

      <main className="pt-20">
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="py-24 md:py-32 bg-bg-surface text-center relative overflow-hidden"
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
              Privacy Policy
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-4 text-lg text-white/60 font-mono"
            >
              Effective date: January 2025
            </motion.p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="py-20 md:py-24"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-bg-surface p-8 md:p-12 rounded-lg premium-glass glass-panel prose prose-invert prose-lg prose-h2:font-display prose-h2:text-gold-400 prose-h2:text-2xl prose-h3:font-display prose-a:text-gold-400 hover:prose-a:text-gold-300">
              <p>
                VisioGold Inc. ("VisioGold", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our VisioGold DRC platform (the "Service").
              </p>
              
              <h2 id="collection">1. Information We Collect</h2>
              <p>
                We may collect both "Personal Information" and "Proprietary Information". Personal Information may include your name, email, and title. Proprietary Information includes any data you upload to the service, such as geological surveys, financial models, or operational plans.
              </p>

              <h2 id="use">2. How We Use Your Information</h2>
              <p>
                We use your information to: (a) create and manage your account; (b) provide, operate, and maintain the Service; (c) process your payments; (d) communicate with you about service updates and support; (e) improve our platform and analyze usage trends. <strong>We will never use your Proprietary Information to train our AI models without your explicit, opt-in consent.</strong>
              </p>

              <h2 id="security">3. Data Storage & Security</h2>
              <p>
                Security is at the core of our architecture. We implement a variety of security measures to maintain the safety of your information.
              </p>
              <ul>
                <li><strong className="text-gold-400">Encryption at Rest:</strong> All of your Proprietary Information stored in our databases is encrypted using industry-standard <strong>AES-256-GCM</strong>. We employ an envelope encryption strategy, where data keys are themselves encrypted with a master key, providing a hierarchical security model.</li>
                <li><strong className="text-gold-400">Row-Level Security (RLS):</strong> Our database architecture, built on PostgreSQL, utilizes rigorous Row-Level Security policies. This ensures that users within your own organization can only access the data they are explicitly granted permission to see, preventing unauthorized internal data exposure.</li>
                <li><strong className="text-gold-400">Encryption in Transit:</strong> All data transferred between you and our Service is encrypted using TLS 1.2 or higher.</li>
                <li><strong className="text-gold-400">Access Controls:</strong> We enforce strict role-based access controls (RBAC) throughout the application.</li>
              </ul>
              

              <h2 id="sharing">4. Data Sharing & Third Parties</h2>
              <p>
                We do not sell, trade, or rent your Personal or Proprietary Information to others. We may share information with trusted third-party service providers who assist us in operating our Service (e.g., payment processors, cloud hosting providers), but only under strict confidentiality agreements.
              </p>

              <h2 id="cookies">5. Cookies & Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to operate and personalize the Service. We use them to maintain your session and remember your preferences. We do not use third-party tracking cookies for advertising purposes.
              </p>

              <h2 id="rights">6. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your Personal Information at any time. You also have the right to export your Proprietary Information from the Service. Please contact us to exercise these rights.
              </p>

              <h2 id="transfers">7. International Data Transfers</h2>
              <p>
                Your information may be transferred to — and maintained on — computers located outside of your state, province, or country. By using the Service, you consent to this transfer.
              </p>

              <h2 id="children">8. Children's Privacy</h2>
              <p>
                Our Service is not intended for use by children under the age of 18, and we do not knowingly collect personal information from children under 18.
              </p>

              <h2 id="changes">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Effective date" at the top.
              </p>
              
              <h2 id="contact">10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@visiogold.com">privacy@visiogold.com</a>.
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
