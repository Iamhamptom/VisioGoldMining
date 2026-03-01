import React from 'react';
import { Activity, AlertTriangle, MapPin, Clock } from 'lucide-react';

export default function GlobeHome() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-light tracking-tight text-white mb-1">Democratic Republic of the Congo</h1>
        <p className="text-sm text-gold uppercase tracking-widest font-semibold">National Overview</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel synthetic-energy p-4 rounded-xl border-gold/20">
          <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Active Permits</div>
          <div className="text-3xl font-mono text-white gold-text-glow gold-text-alive">1,248</div>
        </div>
        <div className="glass-panel synthetic-energy p-4 rounded-xl border-white/10">
          <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Gold Occurrences</div>
          <div className="text-3xl font-mono text-white gold-text-alive">4,892</div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2">Opportunity Feed</h3>
        
        <div className="flex flex-col gap-3">
          <div className="glass-panel synthetic-energy p-4 rounded-xl border-l-2 border-l-gold hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-gold text-xs font-mono">
                <Clock size={14} strokeWidth={1} className="icon-shine" /> Expiring Soon
              </div>
              <span className="text-[10px] text-text-muted">2 hrs ago</span>
            </div>
            <h4 className="text-sm font-medium text-white mb-1">Permit PR-10492 (Ituri)</h4>
            <p className="text-xs text-gray-400">High prospectivity zone. Current holder missed renewal deadline.</p>
          </div>

          <div className="glass-panel synthetic-energy p-4 rounded-xl border-l-2 border-l-white hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-white text-xs font-mono">
                <MapPin size={14} strokeWidth={1} className="icon-shine" /> Open Ground
              </div>
              <span className="text-[10px] text-text-muted">5 hrs ago</span>
            </div>
            <h4 className="text-sm font-medium text-white mb-1">Kilo-Moto Belt Extension</h4>
            <p className="text-xs text-gray-400">Newly released 50km² block adjacent to Kibali operations.</p>
          </div>

          <div className="glass-panel synthetic-energy p-4 rounded-xl border-l-2 border-l-red-500 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-red-400 text-xs font-mono">
                <AlertTriangle size={14} strokeWidth={1} className="icon-shine" /> Risk Update
              </div>
              <span className="text-[10px] text-text-muted">1 day ago</span>
            </div>
            <h4 className="text-sm font-medium text-white mb-1">South Kivu Access</h4>
            <p className="text-xs text-gray-400">Road infrastructure washed out near Kamituga. Logistics costs +15%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
