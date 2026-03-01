import React, { useState } from 'react';
import { Sliders, Download, BarChart3 } from 'lucide-react';

export default function SimulationStudio() {
  const [securityRisk, setSecurityRisk] = useState(50);
  const [remoteness, setRemoteness] = useState(70);
  const [drillingMeters, setDrillingMeters] = useState(10000);

  // Faux calculation for visual feedback
  const baseCost = 2000000;
  const securityMultiplier = 1 + (securityRisk / 100) * 0.5;
  const remotenessMultiplier = 1 + (remoteness / 100) * 0.8;
  const drillingCost = drillingMeters * 150;
  
  const totalCost = (baseCost + drillingCost) * securityMultiplier * remotenessMultiplier;

  return (
    <div className="p-6 flex flex-col h-full">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-white mb-1">Simulation Studio</h1>
          <p className="text-sm text-text-muted">Scenario sandbox for costs, timelines, risks.</p>
        </div>
        <button className="p-2 bg-white/5 hover:bg-gold/20 text-gold rounded-lg transition-colors border border-gold/30">
          <Download size={18} strokeWidth={1} className="icon-shine" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2">
        {/* Output Panel */}
        <div className="glass-panel synthetic-energy p-6 rounded-xl border-gold/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>
          <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">Estimated Project Cost</h3>
          <div className="text-4xl font-mono text-white gold-text-glow mb-1 gold-text-alive">
            ${(totalCost / 1000000).toFixed(2)}M
          </div>
          <p className="text-xs text-gray-400">Confidence Interval: ±15% based on current priors</p>
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <div className="text-[10px] text-text-muted uppercase mb-1">Logistics</div>
              <div className="text-sm font-mono text-white">${((totalCost * 0.3) / 1000000).toFixed(1)}M</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted uppercase mb-1">Drilling</div>
              <div className="text-sm font-mono text-white">${((drillingCost * remotenessMultiplier) / 1000000).toFixed(1)}M</div>
            </div>
            <div>
              <div className="text-[10px] text-text-muted uppercase mb-1">Security</div>
              <div className="text-sm font-mono text-white">${((totalCost * 0.15) / 1000000).toFixed(1)}M</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-panel synthetic-energy p-5 rounded-xl border-white/10 flex flex-col gap-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders size={16} strokeWidth={1} className="text-gold icon-shine" /> Key Drivers
          </h3>
          
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">Security Risk (Escorts, Camp Hardening)</span>
              <span className="text-gold font-mono">{securityRisk}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={securityRisk} 
              onChange={(e) => setSecurityRisk(Number(e.target.value))}
              className="w-full accent-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">Remoteness (Road quality, distance to hub)</span>
              <span className="text-gold font-mono">{remoteness}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={remoteness} 
              onChange={(e) => setRemoteness(Number(e.target.value))}
              className="w-full accent-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300">Drilling Program (Meters)</span>
              <span className="text-gold font-mono">{drillingMeters.toLocaleString()}m</span>
            </div>
            <input 
              type="range" 
              min="0" max="50000" step="1000"
              value={drillingMeters} 
              onChange={(e) => setDrillingMeters(Number(e.target.value))}
              className="w-full accent-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Comparison Chart Placeholder */}
        <div className="glass-panel synthetic-energy p-5 rounded-xl border-white/10">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 size={16} strokeWidth={1} className="text-gold icon-shine" /> Scenario Comparison
          </h3>
          <div className="h-32 flex items-end gap-4 justify-center pt-4 border-b border-l border-white/10 pb-2 pl-2 relative z-10">
            <div className="w-16 bg-white/20 rounded-t-sm relative group flex justify-center" style={{ height: '60%' }}>
              <span className="absolute -top-6 text-xs font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Base</span>
            </div>
            <div className="w-16 bg-gold/80 rounded-t-sm relative group flex justify-center gold-glow" style={{ height: '85%' }}>
              <span className="absolute -top-6 text-xs font-mono text-gold opacity-0 group-hover:opacity-100 transition-opacity">Current</span>
            </div>
            <div className="w-16 bg-white/50 rounded-t-sm relative group flex justify-center" style={{ height: '40%' }}>
              <span className="absolute -top-6 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">Optimized</span>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-2 text-[10px] text-text-muted uppercase relative z-10">
            <span>Base</span>
            <span className="text-gold">Current</span>
            <span>Optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
}
