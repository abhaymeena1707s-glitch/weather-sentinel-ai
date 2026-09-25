import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'blue', onClick }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      iconBg: 'bg-blue-600/10',
      iconColor: 'text-blue-600'
    },
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-600/10',
      iconColor: 'text-emerald-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      iconBg: 'bg-red-600/10',
      iconColor: 'text-red-600'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      iconBg: 'bg-amber-600/10',
      iconColor: 'text-amber-600'
    },
    slate: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-700',
      iconBg: 'bg-slate-600/10',
      iconColor: 'text-slate-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      iconBg: 'bg-purple-600/10',
      iconColor: 'text-purple-600'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`sentinel-card p-4 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all ${scheme.border}`}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <div className="flex items-baseline space-x-2 mt-1">
          <span className="text-2xl font-bold text-slate-800">{value}</span>
          {subtitle && <span className="text-xs text-slate-500 font-medium">{subtitle}</span>}
        </div>
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-lg ${scheme.iconBg} flex items-center justify-center ${scheme.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
