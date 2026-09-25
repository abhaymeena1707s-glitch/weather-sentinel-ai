import React from 'react';

export default function StationStatusBadge({ status = 'normal' }) {
  const map = {
    normal: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    anomaly: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
    quarantined: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300', dot: 'bg-yellow-500' },
    offline: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300', dot: 'bg-slate-400' }
  };

  const current = map[status.toLowerCase()] || map.normal;

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize border ${current.bg} ${current.text} ${current.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} ${status === 'anomaly' ? 'animate-pulse' : ''}`}></span>
      <span>{status}</span>
    </span>
  );
}
