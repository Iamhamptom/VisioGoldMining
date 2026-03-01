import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Clock } from 'lucide-react';
import type { TaskGroup } from '../../types/projectPlan';

interface Props {
  taskGroups: TaskGroup[];
}

export default function GeneratedTaskBoard({ taskGroups }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>(
    Object.fromEntries(taskGroups.map(g => [g.phase, true]))
  );

  const toggle = (phase: number) => setExpanded(prev => ({ ...prev, [phase]: !prev[phase] }));

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
        <FileText size={16} strokeWidth={1} className="text-gold icon-shine" /> Task Breakdown
      </h3>

      {taskGroups.map((group) => (
        <div key={group.phase} className="glass-panel rounded-xl border-white/10 overflow-hidden">
          <button onClick={() => toggle(group.phase)}
            className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-2">
              {expanded[group.phase] ? <ChevronDown size={14} strokeWidth={1} className="text-gold" /> : <ChevronRight size={14} strokeWidth={1} className="text-gray-500" />}
              <span className="text-xs text-gold font-mono">Phase {group.phase}</span>
              <span className="text-sm text-white font-medium">{group.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <span>{group.tasks.length} tasks</span>
              <span className="text-gold font-mono flex items-center gap-1">
                <Clock size={10} strokeWidth={1} /> ~{group.total_duration_days.p50}d
              </span>
            </div>
          </button>

          {expanded[group.phase] && (
            <div className="border-t border-white/5">
              {group.tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between px-4 py-2 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <div className="flex-1">
                    <div className="text-xs text-gray-300">{task.name}</div>
                    <div className="text-[10px] text-text-muted">
                      {task.department.replace(/_/g, ' ')} • {task.duration_days.min}–{task.duration_days.max} days
                    </div>
                  </div>
                  {task.required_docs.length > 0 && (
                    <div className="flex gap-1">
                      {task.required_docs.slice(0, 2).map((doc, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] text-gray-500 truncate max-w-24">{doc}</span>
                      ))}
                      {task.required_docs.length > 2 && (
                        <span className="text-[9px] text-gray-600">+{task.required_docs.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
