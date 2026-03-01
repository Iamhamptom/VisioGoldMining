import React from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import type { ScheduleOutput } from '../../types/simulation';

interface Props {
  schedule: ScheduleOutput;
}

export default function ScheduleCard({ schedule }: Props) {
  return (
    <div className="glass-panel synthetic-energy p-5 rounded-xl border-white/10">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <Calendar size={16} strokeWidth={1} className="text-gold icon-shine" /> Schedule Estimate
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-4 relative z-10">
        <div className="text-center">
          <div className="text-[10px] text-text-muted uppercase mb-1">Optimistic</div>
          <div className="text-2xl font-mono text-green-400">{schedule.min_days}</div>
          <div className="text-[10px] text-text-muted">days ({(schedule.min_days / 30).toFixed(0)} mo)</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gold uppercase mb-1">Expected</div>
          <div className="text-2xl font-mono text-gold gold-text-glow">{schedule.p50_days}</div>
          <div className="text-[10px] text-text-muted">days ({(schedule.p50_days / 30).toFixed(0)} mo)</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-text-muted uppercase mb-1">Conservative</div>
          <div className="text-2xl font-mono text-red-400">{schedule.p90_days}</div>
          <div className="text-[10px] text-text-muted">days ({(schedule.p90_days / 30).toFixed(0)} mo)</div>
        </div>
      </div>

      {schedule.critical_path.length > 0 && (
        <div className="mb-3 relative z-10">
          <div className="text-[10px] text-text-muted uppercase mb-2">Critical Path</div>
          <div className="flex flex-wrap gap-1.5">
            {schedule.critical_path.map((item, i) => (
              <span key={i} className="px-2 py-0.5 bg-gold/10 border border-gold/20 rounded text-[10px] text-gold">{item}</span>
            ))}
          </div>
        </div>
      )}

      {schedule.risk_flags.length > 0 && (
        <div className="relative z-10">
          <div className="text-[10px] text-text-muted uppercase mb-2">Risk Flags</div>
          {schedule.risk_flags.map((flag, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-amber-400 mb-1">
              <AlertTriangle size={12} strokeWidth={1} className="mt-0.5 shrink-0" />
              <span>{flag}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
