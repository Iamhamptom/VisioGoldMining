'use client';

import React from 'react';

const SECTORS = [
  { id: 'mining', label: 'Mining', icon: '⛏️' },
  { id: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
  { id: 'energy', label: 'Energy', icon: '⚡' },
  { id: 'tourism', label: 'Tourism', icon: '📍' },
  { id: 'urban', label: 'Urban', icon: '🏙️' },
  { id: 'forestry', label: 'Forestry', icon: '🌲' },
  { id: 'fisheries', label: 'Fisheries', icon: '🐟' },
];

interface Props {
  selected: string | null;
  onChange: (sector: string | null) => void;
}

export default function SectorFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
          !selected ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
        }`}
      >
        All
      </button>
      {SECTORS.map(s => (
        <button
          key={s.id}
          onClick={() => onChange(selected === s.id ? null : s.id)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            selected === s.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          {s.icon} {s.label}
        </button>
      ))}
    </div>
  );
}
