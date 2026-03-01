import React from 'react';

interface Props {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

export default function ScoreBar({ label, value, icon }: Props) {
  const color = value >= 70 ? '#4ADE80' : value >= 40 ? '#FBBF24' : '#F87171';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-text-muted uppercase tracking-wider flex items-center gap-1">
          {icon} {label}
        </span>
        <span className="font-mono" style={{ color }}>{value}</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
