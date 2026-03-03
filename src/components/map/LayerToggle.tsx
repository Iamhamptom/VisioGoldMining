import React, { useState } from 'react';
import { Layers, Map, Mountain, Gem, ShieldAlert, Route, Loader2, Pickaxe, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { LayerState, LayerDefinition } from '@/lib/types/layers';

const ICON_MAP: Record<string, React.ReactNode> = {
  Map: <Map size={14} strokeWidth={1.5} />,
  Mountain: <Mountain size={14} strokeWidth={1.5} />,
  Gem: <Gem size={14} strokeWidth={1.5} />,
  ShieldAlert: <ShieldAlert size={14} strokeWidth={1.5} />,
  Route: <Route size={14} strokeWidth={1.5} />,
  Pickaxe: <Pickaxe size={14} strokeWidth={1.5} />,
  Flame: <Flame size={14} strokeWidth={1.5} />,
};

interface Props {
  layerStates: Map<string, LayerState>;
  toggleLayer: (id: string) => void;
  definitions: LayerDefinition[];
}

export default function LayerToggle({ layerStates, toggleLayer, definitions }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-14 left-[70px] z-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-lg transition-colors shadow-lg border ${
          isOpen
            ? 'bg-gold-400/15 text-gold-400 border-gold-400/30'
            : 'bg-black/40 backdrop-blur-md text-gray-400 hover:bg-gold-400/15 hover:text-gold-400 border-white/10'
        }`}
        title="Toggle Layers"
      >
        <Layers size={20} strokeWidth={1} className="icon-shine" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mt-2 premium-glass border border-white/10 rounded-xl p-3 shadow-gold-sm min-w-[220px]"
          >
            <h4 className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-3 px-1">
              Data Layers
            </h4>
            <div className="flex flex-col gap-1">
              {definitions.map((def) => {
                const state = layerStates.get(def.id);
                const isVisible = state?.visible ?? false;
                const isLoading = state?.loading ?? false;
                const hasError = !!state?.error;

                return (
                  <button
                    key={def.id}
                    onClick={() => toggleLayer(def.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all w-full text-left group ${
                      isVisible
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 transition-all"
                      style={{
                        backgroundColor: isVisible ? def.legendColor : 'transparent',
                        border: `2px solid ${def.legendColor}`,
                        boxShadow: isVisible ? `0 0 8px ${def.legendColor}60` : 'none',
                      }}
                    />
                    <span className="flex items-center gap-1.5 flex-1 min-w-0">
                      {ICON_MAP[def.icon]}
                      <span className="truncate">{def.label}</span>
                    </span>
                    {isLoading && (
                      <Loader2 size={12} className="animate-spin ml-auto text-gold-400 flex-shrink-0" />
                    )}
                    {hasError && (
                      <span className="ml-auto text-[9px] text-red-400 flex-shrink-0">error</span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
