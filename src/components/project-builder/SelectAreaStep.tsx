import React from 'react';
import { MapPin } from 'lucide-react';

interface Props {
  polygonName: string;
  onPolygonNameChange: (name: string) => void;
}

export default function SelectAreaStep({ polygonName, onPolygonNameChange }: Props) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
        <MapPin size={20} strokeWidth={1} className="text-gold icon-shine" /> Select Target Area
      </h2>
      <p className="text-xs text-text-muted mb-2">Define the polygon or concession area for your project.</p>

      <div className="glass-panel p-4 rounded-xl border-white/10">
        <label className="text-xs text-gray-300 mb-2 block">Project / Polygon Name</label>
        <input
          type="text"
          value={polygonName}
          onChange={(e) => onPolygonNameChange(e.target.value)}
          placeholder="e.g., Kilo-Moto Block 7"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-gold/50 focus:outline-none"
        />
      </div>

      <div className="glass-panel p-4 rounded-xl border-white/10 flex items-center justify-center h-32">
        <div className="text-center">
          <MapPin size={24} strokeWidth={1} className="text-gold/50 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Map polygon selection will be available when map layer is connected</p>
        </div>
      </div>
    </div>
  );
}
