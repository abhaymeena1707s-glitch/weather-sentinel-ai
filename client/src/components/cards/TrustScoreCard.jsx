import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TrustScoreCard({
  score = 87,
  grade = 'A+',
  label = 'High Integrity',
  components = {
    temporalConsistency: 92,
    physicalConsistency: 95,
    multivariateConsistency: 88,
    spatialAgreement: 84,
    sensorHealth: 72,
    dataFreshness: 99
  }
}) {
  // SVG circular calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 85) return '#16A34A'; // green
    if (val >= 70) return '#2563EB'; // blue
    if (val >= 50) return '#D97706'; // amber
    return '#DC2626'; // red
  };

  const ringColor = getScoreColor(score);

  const items = [
    { label: 'Temporal Consistency', val: components.temporalConsistency ?? 92 },
    { label: 'Physical Consistency', val: components.physicalConsistency ?? 95 },
    { label: 'Multivariate Consistency', val: components.multivariateConsistency ?? 88 },
    { label: 'Spatial Agreement', val: components.spatialAgreement ?? 84 },
    { label: 'Sensor Digital Twin Health', val: components.sensorHealth ?? 72 },
    { label: 'Telemetry Freshness', val: components.dataFreshness ?? 99 }
  ];

  return (
    <div className="sentinel-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Weather Trust Score</h3>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
          Composite Index
        </span>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="#E2E8F0"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Value circle */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke={ringColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-slate-800 leading-none">{score}</span>
            <span className="text-[10px] text-slate-400 font-semibold mt-0.5">/ 100</span>
            <span className="text-[9px] font-bold text-blue-600 uppercase mt-0.5">{grade}</span>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="flex-1 w-full space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-600 font-medium">{item.label}</span>
                <span className="font-semibold text-slate-800">{item.val}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.max(0, item.val))}%`,
                    backgroundColor: getScoreColor(item.val)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
