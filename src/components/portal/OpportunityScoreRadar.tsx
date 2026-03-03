'use client';

import React from 'react';
import { useBranding } from './BrandingProvider';
import type { OpportunityListing } from '@/types';
import ExplanationTooltip from './ExplanationTooltip';

interface Props {
  listing: Pick<OpportunityListing, 'score_geological' | 'score_infrastructure' | 'score_legal' | 'score_environmental' | 'score_social'>;
}

const DIMENSIONS = [
  { key: 'score_geological', label: 'Geological', angle: -90, tooltip: 'Quality and quantity of geological data, mineral resource estimates, and exploration results.' },
  { key: 'score_infrastructure', label: 'Infrastructure', angle: -18, tooltip: 'Proximity to roads, power, water, and telecommunications infrastructure.' },
  { key: 'score_legal', label: 'Legal', angle: 54, tooltip: 'Clarity of land tenure, permit status, regulatory compliance, and legal framework.' },
  { key: 'score_environmental', label: 'Environmental', angle: 126, tooltip: 'Environmental baseline, impact assessment status, and sustainability considerations.' },
  { key: 'score_social', label: 'Social', angle: 198, tooltip: 'Community relations, social license, employment impact, and stakeholder engagement.' },
] as const;

export default function OpportunityScoreRadar({ listing }: Props) {
  const { primaryColor } = useBranding();
  const size = 240;
  const center = size / 2;
  const maxRadius = size / 2 - 30;

  // Draw polygon for scores
  const points = DIMENSIONS.map(d => {
    const value = (listing[d.key] ?? 0) as number;
    const normalizedValue = value / 10;
    const rad = (d.angle * Math.PI) / 180;
    return {
      x: center + Math.cos(rad) * maxRadius * normalizedValue,
      y: center + Math.sin(rad) * maxRadius * normalizedValue,
      label: d.label,
      value,
      tooltip: d.tooltip,
      labelX: center + Math.cos(rad) * (maxRadius + 20),
      labelY: center + Math.sin(rad) * (maxRadius + 20),
    };
  });

  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {rings.map(r => {
          const ringPath = DIMENSIONS.map((d, i) => {
            const rad = (d.angle * Math.PI) / 180;
            const x = center + Math.cos(rad) * maxRadius * r;
            const y = center + Math.sin(rad) * maxRadius * r;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ') + ' Z';
          return <path key={r} d={ringPath} fill="none" stroke="#e5e7eb" strokeWidth="1" />;
        })}

        {/* Axes */}
        {DIMENSIONS.map(d => {
          const rad = (d.angle * Math.PI) / 180;
          return (
            <line
              key={d.key}
              x1={center} y1={center}
              x2={center + Math.cos(rad) * maxRadius}
              y2={center + Math.sin(rad) * maxRadius}
              stroke="#e5e7eb" strokeWidth="1"
            />
          );
        })}

        {/* Score polygon */}
        <path d={polygonPath} fill={`${primaryColor}20`} stroke={primaryColor} strokeWidth="2" />

        {/* Score dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={primaryColor} />
        ))}
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
        {points.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: primaryColor }}>
              {p.value.toFixed(1)}
            </div>
            <div>
              <div className="text-xs font-medium text-gray-700">
                {p.label}
                <ExplanationTooltip text={p.tooltip} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
