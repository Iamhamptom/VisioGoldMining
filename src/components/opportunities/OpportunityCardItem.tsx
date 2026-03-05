import { ChevronRight, Map, Pickaxe, Route, Shield, FileCheck, Database, Plus, ScanSearch } from 'lucide-react';
import type { Opportunity } from '../../lib/types/opportunities';
import { useDeepDive } from '@/hooks/useDeepDive';
import ScoreBar from './ScoreBar';

interface Props {
  key?: string;
  opportunity: Opportunity;
  onSelect?: (opp: Opportunity) => void;
  onEvaluate?: () => void;
  onCreateRepo?: (opp: Opportunity) => void;
  compact?: boolean;
}

export default function OpportunityCardItem({ opportunity, onSelect, onEvaluate, onCreateRepo, compact }: Props) {
  const { openDeepDive } = useDeepDive();
  const opp = opportunity;

  return (
    <div
      className="glass-panel synthetic-energy rounded-xl p-5 border-white/10 hover:border-gold-400/50 transition-all group cursor-pointer"
      onClick={() => onSelect?.(opp)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs text-gold-400 font-mono mb-1">{opp.permit_id}</div>
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
              onClick={(e) => { e.stopPropagation(); openDeepDive({ type: 'opportunity', data: opp }); }}
              className="flex-1 py-2 bg-white/5 hover:bg-gold-400 hover:text-black text-gold-400 border border-gold-400/30 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 group-hover:border-gold"
            >
              <ScanSearch size={14} strokeWidth={1} /> Deep Dive
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onEvaluate ? onEvaluate() : onSelect?.(opp); }}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
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
