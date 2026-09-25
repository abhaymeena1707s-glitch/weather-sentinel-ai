import React from 'react';

export default function SeverityBadge({ severity = 'LOW' }) {
  const map = {
    CRITICAL: 'bg-red-700 text-white border-red-800',
    HIGH: 'bg-red-500 text-white border-red-600',
    MEDIUM: 'bg-amber-500 text-white border-amber-600',
    LOW: 'bg-blue-100 text-blue-800 border-blue-200',
    NONE: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const style = map[severity.toUpperCase()] || map.LOW;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style}`}>
      {severity}
    </span>
  );
}
