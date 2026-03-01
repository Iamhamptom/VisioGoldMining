import React from 'react';
import { Compass, Pickaxe, Factory } from 'lucide-react';

interface Props {
  selected: string;
  onSelect: (type: string) => void;
}

const GOALS = [
  {
    id: 'exploration',
    icon: Compass,
    title: 'Greenfield Exploration',
    description: 'Soil sampling, trenching, initial RC drilling. Low initial capex. Typical budget: $1–5M.',
  },
  {
    id: 'small_mine',
    icon: Pickaxe,
    title: 'Small-Scale Mine (Semi-Industrial)',
    description: 'Gravity circuit, minimal footprint, rapid deployment. Typical budget: $5–20M.',
  },
  {
    id: 'industrial',
    icon: Factory,
    title: 'Industrial CIL/CIP Plant',
    description: 'Full feasibility, large scale earthworks, grid power required. Budget: $50M+.',
  },
];

export default function ChooseGoalStep({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <h2 className="text-lg font-medium text-white mb-2">Choose Project Type</h2>
      <div className="grid gap-3">
        {GOALS.map((goal) => {
          const Icon = goal.icon;
          const isActive = selected === goal.id;
          return (
            <div key={goal.id} onClick={() => onSelect(goal.id)}
              className={`glass-panel p-4 rounded-xl cursor-pointer transition-colors relative overflow-hidden ${
                isActive ? 'border-gold/50 bg-gold/5' : 'border-border-panel hover:border-white/30'
              }`}>
              {isActive && <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-bl-full -mr-8 -mt-8"></div>}
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-gold/20 text-gold' : 'bg-white/5 text-gray-400'}`}>
                  <Icon size={18} strokeWidth={1} className="icon-shine" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">{goal.title}</h3>
                  <p className="text-xs text-gray-400">{goal.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
