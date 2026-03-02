import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import createGlobe from 'cobe';
import { ArrowRight, Globe, Compass, HardHat, LineChart, Sparkles, Shield } from 'lucide-react';

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Gold dust / star particles
  const stars = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 3}px`,
    animationDuration: `${3 + Math.random() * 6}s`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: 0.2 + Math.random() * 0.6,
  })), []);

  // Floating particles (rising gold dust)
  const floatingDust = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${12 + Math.random() * 20}s`,
    animationDelay: `-${Math.random() * 20}s`,
    width: `${1 + Math.random() * 2}px`,
    height: `${1 + Math.random() * 2}px`,
  })), []);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
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
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [0.83, 0.68, 0.21],
      glowColor: [0.08, 0.06, 0.02],
      markers: [
        { location: [-4.0383, 21.7587], size: 0.12 }, // DRC center
        { location: [-3.43, 29.22], size: 0.06 },     // Kibali region
        { location: [-11.67, 27.47], size: 0.06 },    // Katanga
        { location: [-2.5, 28.86], size: 0.06 },      // North Kivu
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
        state.width = width * 2;
        state.height = width * 2;
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const journeySteps = [
    { icon: Globe, title: 'Explore', desc: 'Interactive 3D map of DRC mining concessions, geology & infrastructure' },
    { icon: Compass, title: 'Discover', desc: 'AI-scored opportunities ranked by geological potential & risk' },
    { icon: HardHat, title: 'Build', desc: 'Generate project plans, timelines, and compliance checklists' },
    { icon: LineChart, title: 'Simulate', desc: 'Monte Carlo cost modeling with scenario analysis' },
  ];

  return (
    <div className="relative w-screen h-screen bg-transparent overflow-hidden">
      {/* ── Gold dust stars ── */}
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
              boxShadow: `0 0 ${parseInt(s.size) * 4}px rgba(212, 175, 55, ${s.opacity * 0.8})`,
              animation: `star-twinkle ${s.animationDuration} ${s.animationDelay} infinite alternate ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* ── Floating gold dust (rising) ── */}
      <div className="particles-container">
        {floatingDust.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.width,
              height: p.height,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
            }}
          />
        ))}
      </div>

      {/* ── Sonic wave rings ── */}
      <div className="sonic-waves-container">
        <div className="sonic-wave" />
        <div className="sonic-wave" />
        <div className="sonic-wave" />
        <div className="sonic-wave" />
      </div>

      {/* ── Background Globe — right side, 50% more visible ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center pointer-events-none"
        style={{ justifyContent: 'flex-end', paddingRight: '5%' }}
      >
        <div className="relative">
          <canvas
            ref={canvasRef}
            style={{ width: '750px', height: '750px', maxWidth: '55vw', aspectRatio: '1' }}
          />
          {/* Gold glow behind globe */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 60%)',
              transform: 'scale(1.3)',
            }}
          />
        </div>
      </motion.div>

      {/* ── Main Content ── */}
      <div className="relative z-10 w-full h-full flex">
        {/* Left side content */}
        <div className="w-full lg:w-[55%] h-full flex flex-col justify-center px-8 lg:px-16">
          {/* Logo badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-5 mb-8"
          >
            <div className="w-16 h-16 relative flex items-center justify-center group">
              <div className="absolute inset-0 border border-gold/50 rotate-45 gold-glow bg-gold/5 group-hover:rotate-90 transition-transform duration-700"></div>
              <div className="absolute inset-2 border border-gold/20 rotate-45 group-hover:-rotate-45 transition-transform duration-700"></div>
              <span className="text-gold font-display font-bold text-2xl tracking-tighter relative z-10 icon-shine gold-text-alive">VG</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gold uppercase tracking-[0.4em] text-sm font-display font-semibold icon-shine">
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
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-display font-light tracking-widest text-white mb-6 leading-none uppercase text-alive"
          >
            Visio<span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200 icon-shine gold-text-alive">Gold</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed font-medium"
          >
            The premier AI-powered mining intelligence platform for the Democratic Republic of the Congo.
            Real-time geological intelligence, opportunity scoring, project planning, and Monte Carlo simulation — all in one immersive command center.
          </motion.p>

          {/* Journey steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 gap-4 mb-10 max-w-xl"
          >
            {journeySteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 + i * 0.15 }}
                  className="glass-panel rounded-xl p-4 group hover:border-gold/30 transition-all duration-500"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={18} className="text-gold icon-shine group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    <span className="text-white font-display font-semibold text-sm uppercase tracking-wider">{step.title}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex items-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212, 175, 55, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnter}
              className="group relative inline-flex items-center gap-4 px-10 py-5 bg-gold text-black rounded-none font-display font-bold uppercase tracking-widest text-sm overflow-hidden gold-glow transition-all hover:bg-yellow-400"
            >
              <Sparkles size={18} className="relative z-10 icon-shine" />
              <span className="relative z-10">Initialize System</span>
              <ArrowRight strokeWidth={1.5} size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300 icon-shine" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-black z-10"></div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-black z-10"></div>
            </motion.button>

            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <Shield size={14} className="text-gold/50" />
              <span className="font-mono uppercase tracking-wider">Secure • Encrypted • Private</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom status bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-8 right-8 flex justify-between items-center z-10"
      >
        <div className="flex gap-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            Satellites Linked
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-mono">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.5)]"></span>
            AI Core Active
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
            GIS Layers Ready
          </div>
        </div>

        <div className="text-xs text-gray-600 font-mono uppercase tracking-wider">
          v2.0 • DRC Mining Intelligence
        </div>
      </motion.div>
    </div>
  );
}
