import React, { useState } from 'react';
import { Save, Check, FileOutput, GitBranch } from 'lucide-react';

interface Props {
  planName: string;
  hasPlan: boolean;
}

export default function ExportCommitStep({ planName, hasPlan }: Props) {
  const [saved, setSaved] = useState(false);

  if (!hasPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-text-muted animate-in fade-in duration-500">
        <FileOutput size={24} strokeWidth={1} className="mb-2 opacity-50" />
        <p className="text-sm">Generate a plan first to export.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-lg font-medium text-white mb-2">Export + Commit</h2>

      <div className="glass-panel synthetic-energy p-5 rounded-xl border-gold/30">
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="p-2 bg-gold/20 rounded-lg">
            <GitBranch size={18} strokeWidth={1} className="text-gold icon-shine" />
          </div>
          <div>
            <div className="text-sm text-white font-medium">{planName || 'DRC Project Plan'}</div>
            <div className="text-[10px] text-text-muted">Saving to branch as PLAN + TASKS + RISK_REGISTER artifacts</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4 relative z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Check size={12} strokeWidth={1} className="text-green-400" /> Task breakdown (all phases)
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Check size={12} strokeWidth={1} className="text-green-400" /> Document checklist
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Check size={12} strokeWidth={1} className="text-green-400" /> Risk register
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Check size={12} strokeWidth={1} className="text-green-400" /> Timeline estimate
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Check size={12} strokeWidth={1} className="text-green-400" /> Budget simulation (if linked)
          </div>
        </div>

        {saved ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-400 relative z-10">
            <Check size={18} strokeWidth={1} /> Plan saved as artifact with commit
          </div>
        ) : (
          <button onClick={() => setSaved(true)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gold text-black rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-colors relative z-10">
            <Save size={16} strokeWidth={1} /> Save to Branch
          </button>
        )}
      </div>
    </div>
  );
}
