import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType } from '@/lib/types/screen';
import { DRC_PROJECTS } from '@/data/drc-projects';
import { useMapContext } from '@/hooks/useMap';
import GlobeMap from './map/GlobeMap';
import MapControls from './map/MapControls';
import LayerToggle from './map/LayerToggle';
import TerrainControls from './map/TerrainControls';

const STATUS_COLORS: Record<string, string> = {
  producing: '#00FF88',
  producing_disrupted: '#FF8800',
  care_and_maintenance: '#FF4444',
  development: '#4488FF',
  advanced_exploration: '#A78BFA',
  early_exploration: '#C084FC',
  artisanal_alluvial: '#FFD700',
  producing_small: '#00CC66',
  unknown: '#888888',
};

export default function MapArea({ activeScreen }: { activeScreen: ScreenType }) {
  const { map } = useMapContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof DRC_PROJECTS>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter projects as user types
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const q = query.toLowerCase();
    const results = DRC_PROJECTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.operator.toLowerCase().includes(q) ||
      p.location.province.toLowerCase().includes(q) ||
      p.location.belt.toLowerCase().includes(q) ||
      p.projectId.toLowerCase().includes(q) ||
      p.aliases.some(a => a.toLowerCase().includes(q)) ||
      p.status.toLowerCase().replace(/_/g, ' ').includes(q)
    );
    setSearchResults(results);
    setShowResults(true);
  }, []);

  // Fly to a selected search result
  const flyToProject = useCallback((project: typeof DRC_PROJECTS[0]) => {
    if (!map || !project.location.lat || !project.location.lon) return;
    map.flyTo({
      center: [project.location.lon, project.location.lat],
      zoom: 9,
      pitch: 50,
      speed: 0.8,
      essential: true,
    });
    setShowResults(false);
    setSearchQuery(project.name);
  }, [map]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* MapLibre Globe */}
      <GlobeMap />

      {/* Map Controls */}
      <MapControls />

      {/* Layer Toggle Panel */}
      <LayerToggle />

      {/* 3D Terrain Controls */}
      <TerrainControls />

      {/* Search Bar Overlay */}
      <motion.div
        ref={searchRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[420px] z-20"
      >
        <div className="bg-black/70 backdrop-blur-xl rounded-2xl border border-gold/20 shadow-2xl overflow-hidden">
          <div className="flex items-center px-4 py-3">
            <Search size={16} strokeWidth={1.5} className="text-gold mr-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowResults(true); }}
              placeholder="Search projects, companies, provinces..."
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500 font-light"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults([]); setShowResults(false); }}
                className="p-1 hover:bg-white/10 rounded-full transition-colors ml-2"
              >
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showResults && searchResults.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-white/10"
              >
                <div className="max-h-[300px] overflow-y-auto">
                  {searchResults.map((project) => (
                    <button
                      key={project.projectId}
                      onClick={() => flyToProject(project)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                    >
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: STATUS_COLORS[project.status] || '#888',
                          boxShadow: `0 0 6px ${STATUS_COLORS[project.status] || '#888'}40`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white truncate">{project.name}</div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {project.operator} — {project.location.province}
                        </div>
                      </div>
                      {project.totalResourceMoz && (
                        <span className="text-[10px] text-gold font-medium flex-shrink-0">
                          {project.totalResourceMoz} Moz
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showResults && searchQuery && searchResults.length === 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-white/10"
              >
                <div className="px-4 py-3 text-xs text-gray-500 text-center">
                  No projects found for &ldquo;{searchQuery}&rdquo;
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom Right Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md p-5 rounded-2xl text-xs flex flex-col gap-3 border border-white/10 shadow-2xl z-10"
      >
        <h4 className="text-white font-semibold mb-1 uppercase tracking-widest text-[10px]">Project Status</h4>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_8px_rgba(0,255,136,0.6)]"></div> Producing</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-[#4488FF] shadow-[0_0_8px_rgba(68,136,255,0.6)]"></div> Development</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-[#A78BFA] shadow-[0_0_8px_rgba(167,139,250,0.6)]"></div> Exploration</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.6)]"></div> Artisanal</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-[#FF4444] shadow-[0_0_8px_rgba(255,68,68,0.6)]"></div> Care & Maintenance</div>
        <div className="w-full h-px bg-white/10 my-1" />
        <h4 className="text-white font-semibold mb-1 uppercase tracking-widest text-[10px]">Layers</h4>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div> Tenements</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-[#8B7355] shadow-[0_0_8px_rgba(139,115,85,0.6)]"></div> Geology</div>
        <div className="flex items-center gap-3 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div> Security Events</div>
      </motion.div>
    </div>
  );
}
