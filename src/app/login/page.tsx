'use client';

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { motion } from 'motion/react';
import { ArrowRight, Shield, UserPlus, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  // Gold dust particles
  const stars = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 3,
    animationDuration: `${2 + Math.random() * 5}s`,
    animationDelay: `${Math.random() * 4}s`,
    opacity: 0.3 + Math.random() * 0.6,
  })), []);

  // Rising dust
  const floatingDust = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${12 + Math.random() * 16}s`,
    animationDelay: `-${Math.random() * 16}s`,
    size: 1.5 + Math.random() * 2,
  })), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/explorer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: string) => {
    setEmail(`${role}@visiogold.com`);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="ambient-energy" />

      {/* Twinkling gold stars */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {stars.map(s => (
          <div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: s.left,
              top: s.top,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: `rgba(212, 175, 55, ${s.opacity})`,
              boxShadow: `0 0 ${s.size * 5}px rgba(212, 175, 55, ${s.opacity}), 0 0 ${s.size * 2}px rgba(212, 175, 55, ${s.opacity * 0.5})`,
              animation: `star-twinkle ${s.animationDuration} ${s.animationDelay} infinite alternate ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Rising gold particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {floatingDust.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: 'rgba(212, 175, 55, 0.5)',
              boxShadow: `0 0 ${p.size * 5}px rgba(212, 175, 55, 0.6)`,
              animation: `float-up ${p.animationDuration} ${p.animationDelay} infinite linear`,
            }}
          />
        ))}
      </div>

      {/* Sonic waves */}
      <div className="sonic-waves-container" style={{ zIndex: 0 }}>
        <div className="sonic-wave" />
        <div className="sonic-wave" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-md px-6"
        style={{ zIndex: 10 }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="w-16 h-16 relative flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 border border-gold/50 rotate-45 gold-glow bg-gold/5 group-hover:rotate-90 transition-transform duration-700"></div>
            <div className="absolute inset-2 border border-gold/20 rotate-45 group-hover:-rotate-45 transition-transform duration-700"></div>
            <span className="text-gold font-display font-bold text-2xl tracking-tighter relative z-10 icon-shine gold-text-alive">VG</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-white tracking-wider text-alive">
              Visio<span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200 gold-text-alive">Gold</span>
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-[0.3em] font-display">Secure Access Portal</p>
          </div>
        </motion.div>

        {/* Welcome */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed"
        >
          Welcome to the executive mining intelligence platform. Sign in to access your command center.
        </motion.p>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-panel synthetic-energy rounded-2xl p-8"
        >
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs text-gray-400 uppercase tracking-wider font-display flex items-center gap-2">
                <Shield size={12} className="text-gold/60" />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all duration-300 font-light"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs text-gray-400 uppercase tracking-wider font-display">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all duration-300 font-light"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-400 bg-red-400/10 px-4 py-2.5 rounded-lg border border-red-400/20"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gold text-black font-display font-bold uppercase tracking-widest text-sm gold-glow hover:bg-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles size={16} className="animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} strokeWidth={2} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600 uppercase tracking-wider font-mono">Quick Demo</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Demo credential buttons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { role: 'admin', label: 'Admin', desc: 'Full access' },
              { role: 'analyst', label: 'Analyst', desc: 'Read + write' },
              { role: 'viewer', label: 'Viewer', desc: 'Read only' },
            ].map(({ role, label, desc }) => (
              <motion.button
                key={role}
                type="button"
                whileHover={{ scale: 1.05, borderColor: 'rgba(212,175,55,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fillDemoCredentials(role)}
                className="px-3 py-3 rounded-lg border border-white/10 bg-white/5 text-center hover:text-gold hover:bg-gold/5 transition-all duration-300"
              >
                <div className="text-xs text-gray-300 font-display uppercase tracking-wider">{label}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{desc}</div>
              </motion.button>
            ))}
          </div>

          <p className="text-[10px] text-gray-600 text-center font-mono">
            Demo credentials: <span className="text-gray-500">password123</span> for all roles
          </p>
        </motion.div>

        {/* Request access */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          {!showRequest ? (
            <button
              onClick={() => setShowRequest(true)}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gold transition-colors duration-300 font-display uppercase tracking-wider"
            >
              <UserPlus size={14} />
              Request Access
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-xl p-5 text-left"
            >
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                VisioGold is an invite-only platform for mining executives and analysts. Contact your organization admin or reach out to:
              </p>
              <p className="text-sm text-gold font-mono icon-shine">access@visiogold.com</p>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex justify-center gap-6"
        >
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 uppercase tracking-widest font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.5)]"></span>
            256-bit Encrypted
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 uppercase tracking-widest font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_6px_rgba(212,175,55,0.5)]"></span>
            SOC 2 Compliant
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
