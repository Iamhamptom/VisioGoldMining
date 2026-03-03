'use client';

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface Props {
  text: string;
  className?: string;
}

export default function ExplanationTooltip({ text, className = '' }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <span className={`relative inline-block ml-1 ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="More information"
      >
        <HelpCircle size={14} />
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </span>
  );
}
