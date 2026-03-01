import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import createGlobe from 'cobe';
import { ArrowRight, ShieldAlert, Zap } from 'lucide-react';

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      markerColor: [0.83, 0.68, 0.21], // Gold
      glowColor: [0.05, 0.05, 0.05],
      markers: [
        { location: [-4.0383, 21.7587], size: 0.1 } // DRC
      ],
      onRender: (state) => {
        // Auto-rotate slowly
        state.phi = phi;
        phi += 0.002;
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-transparent overflow-hidden flex items-center justify-center">
      {/* Background Globe */}
      <div className="absolute inset-0 flex items-center justify-end opacity-90 pointer-events-none translate-x-1/4">
        <canvas
          ref={canvasRef}
          style={{ width: '800px', height: '800px', maxWidth: '100%', aspectRatio: 1 }}
        />
      </div>

      {/* Content */}
      <div className="z-10 w-full max-w-7xl mx-auto px-8 flex flex-col justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 relative flex items-center justify-center group">
              <div className="absolute inset-0 border border-gold/50 rotate-45 gold-glow bg-gold/5"></div>
              <div className="absolute inset-2 border border-gold/20 rotate-45"></div>
              <span className="text-gold font-display font-bold text-2xl tracking-tighter relative z-10 icon-shine">VG</span>
            </div>
            <span className="text-gold uppercase tracking-[0.4em] text-sm font-display font-semibold icon-shine">Classified Access</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-light tracking-widest text-white mb-6 leading-none uppercase text-alive">
            Visio<span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200 icon-shine gold-text-alive">Gold</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-lg leading-relaxed font-medium">
            Advanced AI-driven mining intelligence and operating system. Discover opportunities, evaluate projects, and simulate costs across the Democratic Republic of the Congo.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnter}
            className="group relative inline-flex items-center gap-4 px-8 py-4 bg-gold text-black rounded-none font-display font-bold uppercase tracking-widest text-sm overflow-hidden gold-glow transition-all hover:bg-yellow-400"
          >
            <span className="relative z-10 text-alive">Initialize System</span>
            <ArrowRight strokeWidth={1} className="relative z-10 group-hover:translate-x-1 transition-transform icon-shine" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-black z-10"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-black z-10"></div>
          </motion.button>
        </motion.div>

        {/* Status Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-8 flex gap-8"
        >
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Satellites Linked
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-mono">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            AI Core Active
          </div>
        </motion.div>
      </div>
    </div>
  );
}
