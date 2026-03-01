import { ChevronRight, Map, Pickaxe, Route, Shield, FileCheck, Database, Plus } from 'lucide-react';
import type { Opportunity } from '../../lib/types/opportunities';
import ScoreBar from './ScoreBar';

interface Props {
  key?: string;
  opportunity: Opportunity;
  onFlyTo?: (opp: Opportunity) => void;
  onCreateRepo?: (opp: Opportunity) => void;
  compact?: boolean;
}

export default function OpportunityCardItem({ opportunity, onFlyTo, onCreateRepo, compact }: Props) {
  const opp = opportunity;

  return (
    <div
      className="glass-panel synthetic-energy rounded-xl p-5 border-white/10 hover:border-gold/50 transition-all group cursor-pointer"
      onClick={() => onFlyTo?.(opp)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs text-gold font-mono mb-1">{opp.permit_id}</div>
          <h3 className="text-base font-semibold text-white">{opp.title}</h3>
          <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
            <Map size={12} strokeWidth={1} className="icon-shine" /> {opp.province}
            {opp.commodity && <> &middot; {opp.commodity}</>}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-mono text-white gold-text-glow gold-text-alive">{opp.composite_score}</div>
          <div className="text-[10px] uppercase tracking-wider text-text-muted">Score</div>
        </div>
      </div>

      {!compact && (
        <>
          <div className="flex flex-col gap-2 mb-4">
            <ScoreBar label="Prospectivity" value={opp.scores.prospectivity.value} icon={<Pickaxe size={10} strokeWidth={1} />} />
            <ScoreBar label="Access" value={opp.scores.access.value} icon={<Route size={10} strokeWidth={1} />} />
            <ScoreBar label="Security" value={opp.scores.security.value} icon={<Shield size={10} strokeWidth={1} />} />
            <ScoreBar label="Legal" value={opp.scores.legal_complexity.value} icon={<FileCheck size={10} strokeWidth={1} />} />
            <ScoreBar label="Data" value={opp.scores.data_completeness.value} icon={<Database size={10} strokeWidth={1} />} />
          </div>

          <p className="text-xs text-gray-400 mb-4 leading-relaxed">{opp.why_explained}</p>

          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onFlyTo?.(opp); }}
              className="flex-1 py-2 bg-white/5 hover:bg-gold hover:text-black text-gold border border-gold/30 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 group-hover:border-gold"
            >
              Evaluate <ChevronRight size={14} strokeWidth={1} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onCreateRepo?.(opp); }}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Create Project Repo"
            >
              <Plus size={14} strokeWidth={1.5} /> Repo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
