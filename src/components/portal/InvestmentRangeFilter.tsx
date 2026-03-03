'use client';

import React from 'react';

const RANGES = [
  { label: 'Any', min: null, max: null },
  { label: '<$100K', min: null, max: 100_000 },
  { label: '$100K–$1M', min: 100_000, max: 1_000_000 },
  { label: '$1M–$10M', min: 1_000_000, max: 10_000_000 },
  { label: '$10M+', min: 10_000_000, max: null },
];

interface Props {
  value: [number | null, number | null];
  onChange: (range: [number | null, number | null]) => void;
}

export default function InvestmentRangeFilter({ value, onChange }: Props) {
  return (
    <select
      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      value={RANGES.findIndex(r => r.min === value[0] && r.max === value[1])}
      onChange={(e) => {
        const r = RANGES[parseInt(e.target.value)];
        onChange([r.min, r.max]);
      }}
    >
      {RANGES.map((r, i) => (
        <option key={i} value={i}>{r.label}</option>
      ))}
    </select>
  );
}
