import { X, Gem, Pickaxe, Crosshair, ArrowRight } from 'lucide-react';
import { useDeepDive } from '@/hooks/useDeepDive';
import { usePursuit } from '@/hooks/usePursuitContext';
import { getTargetName, getTargetScore, getTargetProvince, getTargetStatus } from '@/lib/types/deep-dive';

export default function DeepDiveHeader() {
  const { target, closeDeepDive } = useDeepDive();
  const { startPursuit } = usePursuit();

  if (!target) return null;

  const name = getTargetName(target);
  const score = getTargetScore(target);
  const province = getTargetProvince(target);
  const status = getTargetStatus(target);

  const scoreColor = score !== null
    ? score >= 70 ? '#4ADE80' : score >= 50 ? '#FBBF24' : '#F87171'
    : undefined;

  const handlePursue = () => {
    const id = target.type === 'project'
      ? target.data.projectId
      : target.data.id;
    startPursuit(id);
    closeDeepDive();
  };

  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl shrink-0">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-gold-400/10 border border-gold-400/30 flex items-center justify-center shrink-0">
        {target.type === 'opportunity'
          ? <Gem size={18} className="text-gold-400" />
          : <Pickaxe size={18} className="text-gold-400" />}
      </div>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-semibold text-white truncate">{name}</h2>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-gray-400">{province}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-300 uppercase tracking-wider">
            {status}
          </span>
        </div>
      </div>

      {/* Score badge (opportunity only) */}
      {score !== null && (
        <div className="flex flex-col items-center shrink-0 mr-2">
          <div className="text-2xl font-mono font-bold" style={{ color: scoreColor }}>
            {score}
          </div>
          <div className="text-[9px] uppercase tracking-wider text-gray-500">Score</div>
        </div>
      )}

      {/* Pursue button */}
      <button
        onClick={handlePursue}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400/15 border border-gold-400/30 text-gold-400 text-xs font-medium hover:bg-gold-400/25 transition-colors shrink-0"
      >
        <Crosshair size={14} strokeWidth={1.5} />
        Pursue
        <ArrowRight size={12} />
      </button>

      {/* Close */}
      <button
        onClick={closeDeepDive}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
      >
        <X size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}
