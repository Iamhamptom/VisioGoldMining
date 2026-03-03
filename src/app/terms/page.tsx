'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

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
              <li><Link href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gold-400 transition-colors">Terms & Conditions</Link></li>
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


const TermsPage = () => {
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
              Terms & Conditions
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-4 text-lg text-white/60 font-mono"
            >
              Last updated: January 2025
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
                These Terms and Conditions ("Terms") govern your access to and use of the VisioGold DRC platform and its associated services ("Service"), operated by VisioGold Inc. ("VisioGold", "we", "us", or "our"). By accessing or using the Service, you agree to be bound by these Terms.
              </p>
              
              <h2 id="acceptance">1. Acceptance of Terms</h2>
              <p>
                By creating an account, or by using the Service in any manner, you agree to these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use the Service. These terms constitute a binding legal agreement between you and VisioGold.
              </p>

              <h2 id="service">2. Description of Service</h2>
              <p>
                VisioGold DRC is an enterprise SaaS platform providing mining intelligence, geospatial data analysis, opportunity scoring, project simulation, and related services for professionals operating in the Democratic Republic of Congo (DRC). The Service is provided on a subscription basis.
              </p>

              <h2 id="accounts">3. User Accounts & Registration</h2>
              <p>
                You must register for an account to access the Service. You agree to provide accurate, current, and complete information during registration and to keep this information updated. You are responsible for safeguarding your password and for all activities that occur under your account.
              </p>

              <h2 id="aup">4. Acceptable Use Policy</h2>
              <p>
                You agree not to misuse the Service. This includes, but is not limited to: (a) attempting to reverse engineer the platform; (b) using the Service for any illegal activities, including those contrary to the DRC Mining Code and associated regulations; (c) uploading malicious software; (d) infringing on the intellectual property rights of others or VisioGold.
              </p>

              <h2 id="ip">5. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of VisioGold Inc. and its licensors. Our trademarks may not be used in connection with any product or service without our prior written consent.
              </p>

              <h2 id="data">6. Data & Privacy</h2>
              <p>
                We are committed to protecting your data. Our collection and use of personal and proprietary data in connection with the Service is described in our <Link href="/privacy">Privacy Policy</Link>. You retain all ownership rights to the data you upload to the Service.
              </p>

              <h2 id="liability">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, VisioGold shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the Service.
              </p>

              <h2 id="indemnification">8. Indemnification</h2>
              <p>
                You agree to defend, indemnify and hold harmless VisioGold and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, and expenses, including attorneys' fees, arising from your use of the Service.
              </p>

              <h2 id="termination">9. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>

              <h2 id="law">10. Governing Law</h2>
              <p>
                These Terms shall be governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions. For issues specifically related to mining operations, the laws and regulations of the Democratic Republic of Congo, including the 2018 Mining Code, will be considered as the guiding legal framework for operational conduct.
              </p>

              <h2 id="changes">11. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.
              </p>

              <h2 id="contact">12. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at <a href="mailto:legal@visiogold.com">legal@visiogold.com</a>.
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
