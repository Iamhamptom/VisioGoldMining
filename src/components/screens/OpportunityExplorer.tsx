import React from 'react';
import { Filter, ChevronRight, Shield, Pickaxe, FileCheck, Map } from 'lucide-react';

export default function OpportunityExplorer() {
  const opportunities = [
    { id: 'PR-8832', name: 'Mongbwalu North', province: 'Ituri', score: 92, prospectivity: 'High', access: 'Moderate', security: 'Medium', compliance: 'Low' },
    { id: 'PE-4102', name: 'Twangiza Deep', province: 'South Kivu', score: 85, prospectivity: 'Very High', access: 'Good', security: 'High', compliance: 'High' },
    { id: 'PR-9921', name: 'Kibali South Ext', province: 'Haut-Uele', score: 78, prospectivity: 'Medium', access: 'Excellent', security: 'Low', compliance: 'Medium' },
  ];

  return (
    <div className="p-6 flex flex-col h-full">
      <header className="mb-6">
        <h1 className="text-2xl font-light tracking-tight text-white mb-1">Opportunity Explorer</h1>
        <p className="text-sm text-text-muted">Ranked targets based on multi-factor AI analysis.</p>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button className="glass-panel px-3 py-1.5 rounded-full text-xs flex items-center gap-1 text-white border-gold/50 bg-gold/10 whitespace-nowrap">
          Commodity: Gold
        </button>
        <button className="glass-panel px-3 py-1.5 rounded-full text-xs flex items-center gap-1 text-gray-300 hover:text-white whitespace-nowrap">
          Province: All
        </button>
        <button className="glass-panel px-3 py-1.5 rounded-full text-xs flex items-center gap-1 text-gray-300 hover:text-white whitespace-nowrap">
          Status: Open / Expiring
        </button>
        <button className="glass-panel px-3 py-1.5 rounded-full text-xs flex items-center gap-1 text-gray-300 hover:text-white whitespace-nowrap">
          <Filter size={12} strokeWidth={1} className="icon-shine" /> More
        </button>
      </div>

      <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2">
        {opportunities.map((opp) => (
          <div key={opp.id} className="glass-panel synthetic-energy rounded-xl p-5 border-white/10 hover:border-gold/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-gold font-mono mb-1">{opp.id}</div>
                <h3 className="text-lg font-semibold text-white">{opp.name}</h3>
                <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
                  <Map size={12} strokeWidth={1} className="icon-shine" /> {opp.province}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl font-mono text-white gold-text-glow gold-text-alive">{opp.score}</div>
                <div className="text-[10px] uppercase tracking-wider text-text-muted">AI Score</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5">
              <div className="flex flex-col gap-1">
                <div className="text-[10px] text-text-muted uppercase flex items-center gap-1"><Pickaxe size={10} strokeWidth={1} className="icon-shine"/> Prospectivity</div>
                <div className="text-sm text-white">{opp.prospectivity}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[10px] text-text-muted uppercase flex items-center gap-1"><Map size={10} strokeWidth={1} className="icon-shine"/> Access</div>
                <div className="text-sm text-white">{opp.access}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[10px] text-text-muted uppercase flex items-center gap-1"><Shield size={10} strokeWidth={1} className="icon-shine"/> Security Risk</div>
                <div className={`text-sm ${opp.security === 'High' ? 'text-red-400' : opp.security === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{opp.security}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[10px] text-text-muted uppercase flex items-center gap-1"><FileCheck size={10} strokeWidth={1} className="icon-shine"/> Compliance</div>
                <div className="text-sm text-white">{opp.compliance}</div>
              </div>
            </div>

            <button className="w-full py-2.5 bg-white/5 hover:bg-gold hover:text-black text-gold border border-gold/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:border-gold">
              Evaluate Project <ChevronRight size={16} strokeWidth={1} className="icon-shine" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
