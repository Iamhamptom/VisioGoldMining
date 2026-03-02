'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { motion } from 'motion/react';
import { ArrowRight, Shield, UserPlus, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  // Gold dust particles for login page
  const stars = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 2}px`,
    animationDuration: `${3 + Math.random() * 6}s`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: 0.15 + Math.random() * 0.4,
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
      {/* Ambient background */}
      <div className="ambient-energy" />

      {/* Gold dust stars */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {stars.map(s => (
          <div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              background: `rgba(212, 175, 55, ${s.opacity})`,
              boxShadow: `0 0 ${parseInt(s.size) * 4}px rgba(212, 175, 55, ${s.opacity * 0.6})`,
              animation: `star-twinkle ${s.animationDuration} ${s.animationDelay} infinite alternate ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Sonic waves */}
      <div className="sonic-waves-container">
        <div className="sonic-wave" />
        <div className="sonic-wave" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="w-16 h-16 relative flex items-center justify-center group">
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

        {/* Welcome message */}
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
          <form onSubmit={handleSubmit} className="space-y-5">
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
            <span className="text-xs text-gray-600 uppercase tracking-wider font-mono">Demo Access</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Demo credential buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'admin', label: 'Admin' },
              { role: 'analyst', label: 'Analyst' },
              { role: 'viewer', label: 'Viewer' },
            ].map(({ role, label }) => (
              <motion.button
                key={role}
                type="button"
                whileHover={{ scale: 1.05, borderColor: 'rgba(212,175,55,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fillDemoCredentials(role)}
                className="px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-400 hover:text-gold hover:bg-gold/5 transition-all duration-300 font-display uppercase tracking-wider"
              >
                {label}
              </motion.button>
            ))}
          </div>
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
              <p className="text-sm text-gold font-mono">access@visiogold.com</p>
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
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            256-bit Encrypted
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 uppercase tracking-widest font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            SOC 2 Compliant
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
