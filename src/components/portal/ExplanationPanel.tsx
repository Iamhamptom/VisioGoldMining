'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface Props {
  title?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function ExplanationPanel({ title = 'What does this mean?', children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100/50 transition-colors"
      >
        <HelpCircle size={16} />
        {title}
        {open ? <ChevronUp size={16} className="ml-auto" /> : <ChevronDown size={16} className="ml-auto" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-blue-800 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
