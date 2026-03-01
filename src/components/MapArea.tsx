import React, { useEffect, useRef } from 'react';
import { Layers, Search, Map as MapIcon, Crosshair, ShieldAlert, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import createGlobe from 'cobe';
import { ScreenType } from '../App';

export default function MapArea({ activeScreen }: { activeScreen: ScreenType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);

  useEffect(() => {
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
      theta: 0.15,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 24000,
      mapBrightness: 6,
      baseColor: [0.05, 0.05, 0.05],
      markerColor: [0.83, 0.68, 0.21], // Gold
      glowColor: [0.05, 0.05, 0.05],
      markers: [
        { location: [-4.0383, 21.7587], size: 0.08 }, // DRC Center
        { location: [3.0, 29.5], size: 0.04 }, // Kibali
        { location: [-2.5, 28.8], size: 0.04 }, // Twangiza
      ],
      onRender: (state) => {
        // If not interacting, auto-rotate slowly
        if (!pointerInteracting.current) {
          phiRef.current += 0.001;
        }
        state.phi = phiRef.current + pointerInteractionMovement.current;
      }
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center">
      {/* Interactive Globe */}
      <div className="absolute inset-0 flex items-center justify-center opacity-80 cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', maxWidth: '1200px', aspectRatio: 1 }}
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX;
            canvasRef.current!.style.cursor = 'grabbing';
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            canvasRef.current!.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            canvasRef.current!.style.cursor = 'grab';
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta * 0.01;
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              const delta = e.touches[0].clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta * 0.01;
            }
          }}
        />
      </div>

      {/* Map Controls Overlay */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 left-6 flex flex-col gap-4 z-10"
      >
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2 flex flex-col gap-2 shadow-lg">
          <button className="p-2.5 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-lg transition-colors text-gray-400" title="Layers">
            <Layers size={20} strokeWidth={1} className="icon-shine" />
          </button>
          <button className="p-2.5 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-lg transition-colors text-gray-400" title="Base Map">
            <MapIcon size={20} strokeWidth={1} className="icon-shine" />
          </button>
          <button className="p-2.5 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-lg transition-colors text-gray-400" title="Focus DRC">
            <Crosshair size={20} strokeWidth={1} className="icon-shine" />
          </button>
        </div>
      </motion.div>

      {/* Search Bar Overlay */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[400px] z-10"
      >
        <div className="bg-black/60 backdrop-blur-md rounded-full flex items-center px-5 py-3 border border-gold/30 gold-glow shadow-2xl">
          <Search size={18} strokeWidth={1} className="text-gold mr-3 icon-shine" />
          <input 
            type="text" 
            placeholder="Search permit ID, company, province..." 
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500 font-light"
          />
        </div>
      </motion.div>

      {/* Faux Map Markers (DRC context) - Positioned absolutely over the globe for effect */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="absolute top-[40%] left-[45%] flex flex-col items-center group cursor-pointer z-10"
      >
        <div className="w-4 h-4 bg-gold rounded-full gold-glow animate-pulse"></div>
        <div className="mt-2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs border border-gold/50 text-gold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-xl">
          Kibali Gold Mine
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        className="absolute top-[55%] left-[60%] flex flex-col items-center group cursor-pointer z-10"
      >
        <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
        <div className="mt-2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs border border-red-500/50 text-red-400 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap flex items-center gap-1.5 shadow-xl">
          <ShieldAlert size={12} strokeWidth={1} className="icon-shine" /> High Risk Zone
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, type: "spring" }}
        className="absolute top-[65%] left-[35%] flex flex-col items-center group cursor-pointer z-10"
      >
        <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
        <div className="mt-2 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs border border-white/50 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap flex items-center gap-1.5 shadow-xl">
          <Zap size={12} strokeWidth={1} className="icon-shine" /> New Opportunity (PE-4921)
        </div>
      </motion.div>

      {/* Bottom Right Legend */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md p-5 rounded-2xl text-xs flex flex-col gap-3 border border-white/10 shadow-2xl z-10"
      >
        <h4 className="text-white font-semibold mb-1 uppercase tracking-widest text-[10px]">Map Legend</h4>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div> Active Mines</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div> Open Permits</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div> Security Alerts</div>
      </motion.div>
    </div>
  );
}
