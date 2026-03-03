import React from 'react';
import { Loader2, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import GeneratedTaskBoard from './GeneratedTaskBoard';
import DocsChecklist from './DocsChecklist';
import type { ProjectPlan } from '../../types/projectPlan';

interface Props {
  plan: ProjectPlan | null;
  loading: boolean;
  error: string | null;
}

export default function GeneratePlanStep({ plan, loading, error }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 animate-in fade-in duration-500">
        <Loader2 size={32} strokeWidth={1} className="text-gold-400 animate-spin mb-4" />
        <p className="text-sm text-text-muted">Generating your DRC project plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-lg font-medium text-white">Generated Plan</h2>

      {/* Timeline Summary */}
      {plan.timeline_summary && (
        <div className="glass-panel synthetic-energy p-4 rounded-xl border-gold-400/30">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} strokeWidth={1} className="text-gold-400 icon-shine" />
            <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Timeline Overview</span>
          </div>
          <div className="text-2xl font-mono text-white gold-text-glow mb-2 relative z-10">
            ~{Math.round(plan.timeline_summary.total_p50_days / 30)} months
          </div>
          <div className="text-xs text-gray-400 relative z-10">
            ({plan.timeline_summary.total_p50_days} days across {plan.timeline_summary.phases.length} phases)
          </div>
        </div>
      )}

      {/* Budget Summary */}
      {plan.budget_summary && (
        <div className="glass-panel synthetic-energy p-4 rounded-xl border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={16} strokeWidth={1} className="text-gold-400 icon-shine" />
            <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Budget Summary</span>
          </div>
          <div className="text-2xl font-mono text-white gold-text-glow mb-3 relative z-10">
            ${(plan.budget_summary.total_p50 / 1_000_000).toFixed(2)}M
          </div>
          <div className="grid grid-cols-2 gap-2 relative z-10">
            {plan.budget_summary.department_costs.slice(0, 6).map((d) => (
              <div key={d.department} className="flex justify-between text-xs">
                <span className="text-gray-400 truncate">{d.label}</span>
                <span className="text-white font-mono">${(d.p50 / 1_000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks */}
      <GeneratedTaskBoard taskGroups={plan.task_groups} />

      {/* Documents */}
      <DocsChecklist checklists={plan.doc_checklists} />

      {/* Risk Register */}
      {plan.risk_register.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={16} strokeWidth={1} className="text-gold-400 icon-shine" /> Risk Register
          </h3>
          {plan.risk_register.map((risk) => {
            const impactColor = risk.impact === 'high' ? 'text-red-400' : risk.impact === 'medium' ? 'text-gold' : 'text-green-400';
            return (
              <div key={risk.id} className="glass-panel p-3 rounded-xl border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white font-medium">{risk.category}</span>
                  <div className="flex gap-2 text-[10px]">
                    <span className="text-gray-400">Likelihood: <span className="text-white capitalize">{risk.likelihood}</span></span>
                    <span className="text-gray-400">Impact: <span className={`capitalize ${impactColor}`}>{risk.impact}</span></span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-1">{risk.description}</p>
                <p className="text-[10px] text-gray-500"><span className="text-gold-400">Mitigation:</span> {risk.mitigation}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
