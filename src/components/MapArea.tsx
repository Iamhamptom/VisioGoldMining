import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType } from '@/lib/types/screen';
import { DRC_PROJECTS } from '@/data/drc-projects';
import { useMapContext } from '@/hooks/useMap';
import { useLayers } from '@/hooks/useLayers';
import { useExploreMode } from '@/hooks/useExploreMode';
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
  const { isExploreMode, exitExploreMode } = useExploreMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof DRC_PROJECTS>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const [focusedProjectId, setFocusedProjectId] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Layer management — lifted here so GlobeMap can read visibility
  const { layerStates, toggleLayer, definitions } = useLayers();
  const showProjectMarkers = layerStates.get('drc-projects')?.visible ?? true;

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
    setFocusedProjectId(project.projectId);
    if (map && project.location.lat && project.location.lon) {
      map.flyTo({
        center: [project.location.lon, project.location.lat],
        zoom: 9,
        pitch: 50,
        speed: 0.8,
        essential: true,
      });
    }
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
    <div className="absolute inset-0 bg-bg-dark overflow-hidden">
      {/* MapLibre Globe */}
      <GlobeMap
        isSatellite={isSatellite}
        showProjectMarkers={showProjectMarkers}
        focusedProjectId={focusedProjectId}
      />

      {/* Map Controls */}
      <MapControls isSatellite={isSatellite} onToggleSatellite={() => setIsSatellite(s => !s)} />

      {/* Layer Toggle Panel — receives layer state as props */}
      <LayerToggle layerStates={layerStates} toggleLayer={toggleLayer} definitions={definitions} />

      {/* 3D Terrain Controls */}
      <TerrainControls />

      {/* Search Bar Overlay */}
      <motion.div
        ref={searchRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[380px] max-w-[50vw] z-20"
      >
        <div className="premium-glass rounded-2xl border border-gold-400/20 shadow-gold-sm overflow-hidden">
          <div className="flex items-center px-4 py-3">
            <Search size={16} strokeWidth={1.5} className="text-gold-400 mr-3 flex-shrink-0 icon-shine" />
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
                        <span className="text-[10px] text-gold-400 font-medium flex-shrink-0">
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

      {/* Exit Explore Mode Pill */}
      <AnimatePresence>
        {isExploreMode && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={exitExploreMode}
            className="absolute top-6 right-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/15 border border-gold-400/40 text-gold-400 text-xs font-medium backdrop-blur-md hover:bg-gold-400/25 transition-colors shadow-lg"
          >
            <Minimize2 size={14} strokeWidth={1.5} />
            EXIT EXPLORE MODE
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Right Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-6 right-6 premium-glass p-4 rounded-2xl text-xs flex flex-col gap-2.5 border border-white/10 shadow-gold-sm z-10 max-w-[200px]"
      >
        <h4 className="text-white font-semibold uppercase tracking-widest text-[10px]">Project Status</h4>
        <div className="flex items-center gap-2.5 text-gray-300"><div className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_6px_rgba(0,255,136,0.6)]"></div><span className="truncate">Producing</span></div>
        <div className="flex items-center gap-2.5 text-gray-300"><div className="w-2 h-2 rounded-full bg-[#4488FF] shadow-[0_0_6px_rgba(68,136,255,0.6)]"></div><span className="truncate">Development</span></div>
        <div className="flex items-center gap-2.5 text-gray-300"><div className="w-2 h-2 rounded-full bg-[#A78BFA] shadow-[0_0_6px_rgba(167,139,250,0.6)]"></div><span className="truncate">Exploration</span></div>
        <div className="flex items-center gap-2.5 text-gray-300"><div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_6px_rgba(255,215,0,0.6)]"></div><span className="truncate">Artisanal</span></div>
        <div className="flex items-center gap-2.5 text-gray-300"><div className="w-2 h-2 rounded-full bg-[#FF4444] shadow-[0_0_6px_rgba(255,68,68,0.6)]"></div><span className="truncate">Care & Maint.</span></div>
      </motion.div>
    </div>
  );
}
