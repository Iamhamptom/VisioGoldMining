import { Pickaxe, Route, Shield, FileCheck, Database, MapPin, ChevronRight, Crosshair, Ruler, Gem } from 'lucide-react';
import ScoreBar from '../opportunities/ScoreBar';

interface Props {
  properties: Record<string, unknown>;
  onEvaluate?: () => void;
}

export default function OpportunityDetailCard({ properties, onEvaluate }: Props) {
  const title = String(properties.title || 'Unknown');
  const permitId = String(properties.permit_id || '');
  const province = String(properties.province || 'Unknown');
  const commodity = String(properties.commodity || 'Gold');
  const compositeScore = Number(properties.composite_score) || 0;
  const areaKm2 = Number(properties.area_km2) || 0;
  const whyExplained = String(properties.why_explained || '');

  const scores = properties.scores as {
    prospectivity: { value: number };
    access: { value: number };
    security: { value: number };
    legal_complexity: { value: number };
    data_completeness: { value: number };
  } | undefined;

  const actions = (properties.recommended_next_actions as string[]) || [];

  const scoreColor = compositeScore >= 70 ? '#4ADE80' : compositeScore >= 50 ? '#FBBF24' : '#F87171';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-400/10 border border-gold-400/30 flex items-center justify-center shrink-0">
            <Gem size={18} className="text-gold-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{permitId}</p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <div className="text-2xl font-mono font-bold" style={{ color: scoreColor }}>
              {compositeScore}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-gray-500">Score</div>
          </div>
        </div>
      </div>

      {/* Key Facts */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/5 rounded-lg p-2.5 text-center">
          <MapPin size={12} className="text-blue-400 mx-auto mb-1" />
          <div className="text-[10px] text-white font-medium truncate">{province}</div>
          <div className="text-[8px] text-gray-500 uppercase tracking-wider">Province</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5 text-center">
          <Pickaxe size={12} className="text-gold-400 mx-auto mb-1" />
          <div className="text-[10px] text-white font-medium truncate">{commodity}</div>
          <div className="text-[8px] text-gray-500 uppercase tracking-wider">Commodity</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5 text-center">
          <Ruler size={12} className="text-purple-400 mx-auto mb-1" />
          <div className="text-[10px] text-white font-medium">{areaKm2 > 0 ? `${areaKm2} km²` : 'N/A'}</div>
          <div className="text-[8px] text-gray-500 uppercase tracking-wider">Area</div>
        </div>
      </div>

      {/* Score Breakdown */}
      {scores && (
        <div className="space-y-1">
          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Score Breakdown</h4>
          <div className="flex flex-col gap-2.5">
            <ScoreBar label="Prospectivity" value={scores.prospectivity.value} icon={<Pickaxe size={10} strokeWidth={1} />} />
            <ScoreBar label="Access" value={scores.access.value} icon={<Route size={10} strokeWidth={1} />} />
            <ScoreBar label="Security" value={scores.security.value} icon={<Shield size={10} strokeWidth={1} />} />
            <ScoreBar label="Legal" value={scores.legal_complexity.value} icon={<FileCheck size={10} strokeWidth={1} />} />
            <ScoreBar label="Data" value={scores.data_completeness.value} icon={<Database size={10} strokeWidth={1} />} />
          </div>
        </div>
      )}

      {/* Analysis */}
      {whyExplained && (
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1.5">Analysis</h4>
          <p className="text-xs text-gray-300 leading-relaxed">{whyExplained}</p>
        </div>
      )}

      {/* Recommended Actions */}
      {actions.length > 0 && (
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">Next Steps</h4>
          <div className="space-y-1.5">
            {actions.map((action, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                <ChevronRight size={12} className="text-gold-400 mt-0.5 shrink-0" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onEvaluate}
          className="flex-1 py-2.5 bg-white/5 hover:bg-gold-400 hover:text-black text-gold-400 border border-gold-400/30 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
        >
          <FileCheck size={14} strokeWidth={1.5} />
          Full Evaluation
        </button>
        <button
          className="flex-1 py-2.5 bg-gold-400/10 hover:bg-gold-400/20 text-gold-400 border border-gold-400/30 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
        >
          <Crosshair size={14} strokeWidth={1.5} />
          Pursue
        </button>
      </div>
    </div>
  );
}
