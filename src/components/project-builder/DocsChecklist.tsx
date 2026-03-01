import React, { useState } from 'react';
import { FileText, CheckSquare, Square } from 'lucide-react';
import type { DocChecklist } from '../../types/projectPlan';

interface Props {
  checklists: DocChecklist[];
}

export default function DocsChecklist({ checklists }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  const totalItems = checklists.reduce((s, c) => s + c.items.length, 0);
  const completedItems = Object.values(checked).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <FileText size={16} strokeWidth={1} className="text-gold icon-shine" /> Document Checklist
        </h3>
        <span className="text-[10px] text-text-muted font-mono">{completedItems}/{totalItems} complete</span>
      </div>

      {checklists.map((cat) => (
        <div key={cat.category} className="glass-panel p-3 rounded-xl border-white/10">
          <div className="text-xs text-gold font-medium mb-2 uppercase tracking-wider">{cat.category}</div>
          <div className="flex flex-col gap-1.5">
            {cat.items.map((item) => {
              const key = `${cat.category}:${item.name}`;
              const isChecked = checked[key] ?? false;
              return (
                <button key={key} onClick={() => toggle(key)}
                  className="flex items-center gap-2 text-xs text-left hover:bg-white/5 rounded p-1 transition-colors">
                  {isChecked
                    ? <CheckSquare size={14} strokeWidth={1} className="text-gold shrink-0" />
                    : <Square size={14} strokeWidth={1} className="text-gray-600 shrink-0" />
                  }
                  <span className={isChecked ? 'text-gray-500 line-through' : 'text-gray-300'}>{item.name}</span>
                  {item.required && <span className="text-[8px] text-red-400 uppercase ml-auto">Required</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
