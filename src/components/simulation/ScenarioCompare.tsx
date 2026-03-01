import React, { useState } from 'react';
import { BarChart3, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { ScenarioComparison } from '../../types/simulation';

interface SavedSim {
  id: string;
  name: string;
}

interface Props {
  savedSimulations: SavedSim[];
  onCompare: (idA: string, idB: string) => Promise<void>;
  comparison: ScenarioComparison | null;
  loading?: boolean;
}

function formatDelta(value: number): string {
  const abs = Math.abs(value);
  const prefix = value > 0 ? '+' : value < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${prefix}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${prefix}$${(abs / 1_000).toFixed(0)}K`;
  return `${prefix}$${abs.toLocaleString()}`;
}

export default function ScenarioCompare({ savedSimulations, onCompare, comparison, loading }: Props) {
  const [idA, setIdA] = useState('');
  const [idB, setIdB] = useState('');

  return (
    <div className="glass-panel synthetic-energy p-5 rounded-xl border-white/10">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <BarChart3 size={16} strokeWidth={1} className="text-gold icon-shine" /> Scenario Comparison
      </h3>

      <div className="flex gap-3 mb-4 relative z-10">
        <select value={idA} onChange={(e) => setIdA(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-gold/50 focus:outline-none">
          <option value="" className="bg-black">Scenario A...</option>
          {savedSimulations.map(s => <option key={s.id} value={s.id} className="bg-black">{s.name}</option>)}
        </select>
        <select value={idB} onChange={(e) => setIdB(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-gold/50 focus:outline-none">
          <option value="" className="bg-black">Scenario B...</option>
          {savedSimulations.map(s => <option key={s.id} value={s.id} className="bg-black">{s.name}</option>)}
        </select>
        <button onClick={() => idA && idB && onCompare(idA, idB)} disabled={!idA || !idB || loading}
          className="px-4 py-2 bg-gold text-black rounded-lg text-sm font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50">
          {loading ? '...' : 'Compare'}
        </button>
      </div>

      {comparison && (
        <div className="relative z-10">
          <div className="flex justify-between text-xs text-text-muted mb-3 px-1">
            <span>A: {comparison.scenario_a.name}</span>
            <span>B: {comparison.scenario_b.name}</span>
          </div>

          <div className="space-y-1 mb-4">
            {comparison.delta_cost.map((d) => {
              const Icon = d.delta_p50 > 0 ? ArrowUpRight : d.delta_p50 < 0 ? ArrowDownRight : Minus;
              const color = d.delta_p50 > 0 ? 'text-red-400' : d.delta_p50 < 0 ? 'text-green-400' : 'text-gray-500';
              return (
                <div key={d.department} className="flex justify-between items-center py-1 px-2 hover:bg-white/5 rounded text-xs">
                  <span className="text-gray-300">{d.label}</span>
                  <span className={`font-mono flex items-center gap-1 ${color}`}>
                    <Icon size={12} strokeWidth={1} /> {formatDelta(d.delta_p50)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center py-2 px-2 border-t border-gold/20 text-sm font-semibold">
            <span className="text-gold">Total Delta</span>
            <span className={`font-mono ${comparison.delta_total > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {formatDelta(comparison.delta_total)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 px-2 text-xs">
            <span className="text-gray-400">Schedule Delta</span>
            <span className={`font-mono ${comparison.delta_schedule_days > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {comparison.delta_schedule_days > 0 ? '+' : ''}{comparison.delta_schedule_days} days
            </span>
          </div>

          <div className="mt-4 p-3 bg-gold/5 border border-gold/20 rounded-lg">
            <div className="text-[10px] text-gold uppercase tracking-wider mb-1">Recommendation</div>
            <p className="text-xs text-gray-300 leading-relaxed">{comparison.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
