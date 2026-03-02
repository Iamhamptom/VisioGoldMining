import { useState } from 'react';
import { Mountain, Flame, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMapContext } from '../../hooks/useMap';
import { TERRAIN_DEFAULTS } from '../../lib/map-config';

export default function TerrainControls() {
  const { map } = useMapContext();
  const [isOpen, setIsOpen] = useState(false);
  const [terrainEnabled, setTerrainEnabled] = useState(true);
  const [exaggeration, setExaggeration] = useState(TERRAIN_DEFAULTS.exaggeration);
  const [heatmapVisible, setHeatmapVisible] = useState(false);

  const toggleTerrain = () => {
    if (!map) return;
    const next = !terrainEnabled;
    setTerrainEnabled(next);
    if (next) {
      try {
        map.setTerrain({ source: 'terrain-dem', exaggeration });
      } catch { /* terrain source may not be ready */ }
    } else {
      map.setTerrain(null as unknown as Parameters<typeof map.setTerrain>[0]);
    }
  };

  const handleExaggeration = (val: number) => {
    setExaggeration(val);
    if (!map || !terrainEnabled) return;
    try {
      map.setTerrain({ source: 'terrain-dem', exaggeration: val });
    } catch { /* ignore */ }
  };

  const toggleHeatmap = () => {
    if (!map) return;
    const next = !heatmapVisible;
    setHeatmapVisible(next);
    try {
      const layer = map.getLayer('mineral-heatmap-heat');
      if (layer) {
        map.setLayoutProperty('mineral-heatmap-heat', 'visibility', next ? 'visible' : 'none');
      }
    } catch { /* layer may not exist yet */ }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 }}
      className="absolute bottom-6 left-6 z-10"
    >
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl shadow-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-3 w-full hover:bg-white/5 transition-colors"
        >
          <Mountain size={18} strokeWidth={1} className="text-gold icon-shine" />
          <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">3D Terrain</span>
          {isOpen ? (
            <ChevronDown size={14} className="text-gray-500 ml-auto" />
          ) : (
            <ChevronUp size={14} className="text-gray-500 ml-auto" />
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-3">
                {/* Terrain Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">3D Elevation</span>
                  <button
                    onClick={toggleTerrain}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      terrainEnabled ? 'bg-gold/40' : 'bg-white/10'
                    }`}
                  >
                    <motion.div
                      animate={{ x: terrainEnabled ? 20 : 2 }}
                      className={`absolute top-0.5 w-4 h-4 rounded-full shadow transition-colors ${
                        terrainEnabled ? 'bg-gold' : 'bg-gray-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Exaggeration Slider */}
                {terrainEnabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Exaggeration</span>
                      <span className="text-xs text-gold font-mono">{exaggeration.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min={TERRAIN_DEFAULTS.minExaggeration}
                      max={TERRAIN_DEFAULTS.maxExaggeration}
                      step={0.1}
                      value={exaggeration}
                      onChange={(e) => handleExaggeration(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                    />
                  </div>
                )}

                {/* Heatmap Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame size={14} strokeWidth={1} className="text-orange-400" />
                    <span className="text-xs text-gray-400">Gold Heatmap</span>
                  </div>
                  <button
                    onClick={toggleHeatmap}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    {heatmapVisible ? (
                      <Eye size={14} className="text-gold" />
                    ) : (
                      <EyeOff size={14} className="text-gray-500" />
                    )}
                  </button>
                </div>

                {/* Pitch Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={() => map?.easeTo({ pitch: 0, duration: 500 })}
                    className="flex-1 text-[10px] text-gray-400 hover:text-gold py-1.5 rounded-lg bg-white/5 hover:bg-gold/10 transition-colors"
                  >
                    2D View
                  </button>
                  <button
                    onClick={() => map?.easeTo({ pitch: 45, duration: 500 })}
                    className="flex-1 text-[10px] text-gray-400 hover:text-gold py-1.5 rounded-lg bg-white/5 hover:bg-gold/10 transition-colors"
                  >
                    3D Tilt
                  </button>
                  <button
                    onClick={() => map?.easeTo({ pitch: 75, duration: 500 })}
                    className="flex-1 text-[10px] text-gray-400 hover:text-gold py-1.5 rounded-lg bg-white/5 hover:bg-gold/10 transition-colors"
                  >
                    Immersive
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
