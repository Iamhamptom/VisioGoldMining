'use client';

import React from 'react';
import type { KeyFact } from '@/types';
import ExplanationTooltip from './ExplanationTooltip';

interface Props {
  facts: KeyFact[];
}

export default function KeyFactsGrid({ facts }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {facts.map((fact, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">
            {fact.label}
            {fact.tooltip && <ExplanationTooltip text={fact.tooltip} />}
          </div>
          <div className="text-sm font-semibold text-gray-900">{fact.value}</div>
        </div>
      ))}
    </div>
  );
}
