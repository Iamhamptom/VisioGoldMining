import React from 'react';
import { DollarSign } from 'lucide-react';
import type { DepartmentCost, CostRange } from '../../types/simulation';

interface Props {
  departments: DepartmentCost[];
  totalCost: CostRange;
}

function formatUSD(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function ConfidenceBar({ min, p50, p90, maxVal }: { min: number; p50: number; p90: number; maxVal: number }) {
  const scale = (v: number) => Math.max(2, (v / maxVal) * 100);
  return (
    <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <div className="absolute h-full bg-green-500/40 rounded-full" style={{ width: `${scale(p90)}%` }} />
      <div className="absolute h-full bg-gold/60 rounded-full" style={{ width: `${scale(p50)}%` }} />
      <div className="absolute h-full bg-green-400/80 rounded-full" style={{ width: `${scale(min)}%` }} />
    </div>
  );
}

export default function CostBreakdownTable({ departments, totalCost }: Props) {
  const maxP90 = Math.max(...departments.map(d => d.cost.p90), 1);

  return (
    <div className="glass-panel synthetic-energy p-5 rounded-xl border-white/10">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <DollarSign size={16} strokeWidth={1} className="text-gold icon-shine" /> Cost by Department
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-xs relative z-10">
          <thead>
            <tr className="text-text-muted uppercase tracking-wider border-b border-white/10">
              <th className="text-left py-2 pr-2">Department</th>
              <th className="text-right py-2 px-2">P10</th>
              <th className="text-right py-2 px-2">P50</th>
              <th className="text-right py-2 px-2">P90</th>
              <th className="py-2 px-2 w-24">Range</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.department} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2 pr-2 text-gray-300">{dept.label}</td>
                <td className="text-right py-2 px-2 font-mono text-green-400">{formatUSD(dept.cost.min)}</td>
                <td className="text-right py-2 px-2 font-mono text-gold">{formatUSD(dept.cost.p50)}</td>
                <td className="text-right py-2 px-2 font-mono text-red-400">{formatUSD(dept.cost.p90)}</td>
                <td className="py-2 px-2">
                  <ConfidenceBar min={dept.cost.min} p50={dept.cost.p50} p90={dept.cost.p90} maxVal={maxP90} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gold/30 font-semibold">
              <td className="py-3 pr-2 text-gold">TOTAL</td>
              <td className="text-right py-3 px-2 font-mono text-green-400">{formatUSD(totalCost.min)}</td>
              <td className="text-right py-3 px-2 font-mono text-gold gold-text-glow">{formatUSD(totalCost.p50)}</td>
              <td className="text-right py-3 px-2 font-mono text-red-400">{formatUSD(totalCost.p90)}</td>
              <td className="py-3 px-2">
                <ConfidenceBar min={totalCost.min} p50={totalCost.p50} p90={totalCost.p90} maxVal={totalCost.p90} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
