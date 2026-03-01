import { useState } from 'react';
import { Crosshair, ZoomIn, ZoomOut, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMapContext } from '../../hooks/useMap';
import { FLY_TO_PRESETS, DRC_CENTER, DRC_ZOOM } from '../../lib/map-config';

export default function MapControls() {
  const { map } = useMapContext();
  const [presetsOpen, setPresetsOpen] = useState(false);

  const flyToDRC = () => {
    map?.flyTo({ center: DRC_CENTER, zoom: DRC_ZOOM, speed: 1.2, essential: true });
  };

  const zoomIn = () => { map?.zoomIn(); };
  const zoomOut = () => { map?.zoomOut(); };

  const flyToPreset = (preset: typeof FLY_TO_PRESETS[number]) => {
    map?.flyTo({ center: preset.center as [number, number], zoom: preset.zoom, speed: 1.2, essential: true });
    setPresetsOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute top-6 left-6 flex flex-col gap-3 z-10"
    >
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2 flex flex-col gap-2 shadow-lg">
        <button
          onClick={zoomIn}
          className="p-2.5 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-lg transition-colors text-gray-400"
          title="Zoom In"
        >
          <ZoomIn size={20} strokeWidth={1} className="icon-shine" />
        </button>
        <button
          onClick={zoomOut}
          className="p-2.5 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-lg transition-colors text-gray-400"
          title="Zoom Out"
        >
          <ZoomOut size={20} strokeWidth={1} className="icon-shine" />
        </button>
        <div className="w-full h-px bg-white/10" />
        <button
          onClick={flyToDRC}
          className="p-2.5 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-lg transition-colors text-gray-400"
          title="Focus DRC"
        >
          <Crosshair size={20} strokeWidth={1} className="icon-shine" />
        </button>
        <div className="relative">
          <button
            onClick={() => setPresetsOpen(!presetsOpen)}
            className="p-2.5 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-lg transition-colors text-gray-400 w-full flex items-center justify-center"
            title="Fly-to Presets"
          >
            <Globe size={20} strokeWidth={1} className="icon-shine" />
          </button>
          <AnimatePresence>
            {presetsOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-full top-0 ml-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-2 shadow-xl min-w-[160px]"
              >
                {FLY_TO_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => flyToPreset(preset)}
                    className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-gold hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
