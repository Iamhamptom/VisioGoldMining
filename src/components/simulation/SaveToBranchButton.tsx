import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';

interface Props {
  hasResults: boolean;
  scenarioName: string;
  onNameChange: (name: string) => void;
}

export default function SaveToBranchButton({ hasResults, scenarioName, onNameChange }: Props) {
  const [saved, setSaved] = useState(false);

  if (!hasResults) return null;

  return (
    <div className="flex gap-2 relative z-10">
      <input
        type="text"
        value={scenarioName}
        onChange={(e) => { onNameChange(e.target.value); setSaved(false); }}
        placeholder="Scenario name..."
        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-gold-400/50 focus:outline-none"
      />
      {saved ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
          <Check size={16} strokeWidth={1} /> Saved
        </div>
      ) : (
        <button
          onClick={() => setSaved(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-400/20 text-gold-400 border border-gold-400/30 rounded-lg text-sm hover:bg-gold-400/30 transition-colors"
        >
          <Save size={16} strokeWidth={1} className="icon-shine" /> Save
        </button>
      )}
    </div>
  );
}
