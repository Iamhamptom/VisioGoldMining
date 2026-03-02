import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { ScreenType } from '@/lib/types/screen';
import GlobeMap from './map/GlobeMap';
import MapControls from './map/MapControls';
import LayerToggle from './map/LayerToggle';

export default function MapArea({ activeScreen }: { activeScreen: ScreenType }) {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* MapLibre Globe */}
      <GlobeMap />

      {/* Map Controls */}
      <MapControls />

      {/* Layer Toggle Panel */}
      <LayerToggle />

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

      {/* Bottom Right Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md p-5 rounded-2xl text-xs flex flex-col gap-3 border border-white/10 shadow-2xl z-10"
      >
        <h4 className="text-white font-semibold mb-1 uppercase tracking-widest text-[10px]">Map Legend</h4>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div> Tenements</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-[#8B7355] shadow-[0_0_8px_rgba(139,115,85,0.6)]"></div> Geology</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.6)]"></div> Occurrences</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div> Security Events</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-[#4488FF] shadow-[0_0_8px_rgba(68,136,255,0.6)]"></div> Infrastructure</div>
      </motion.div>
    </div>
  );
}
