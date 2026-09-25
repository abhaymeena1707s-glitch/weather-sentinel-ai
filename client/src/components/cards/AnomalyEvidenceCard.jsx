import React from 'react';
import { Clock, MapPin, Layers, Shield, Calendar, HeartPulse, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AnomalyEvidenceCard({ evidence = {} }) {
  const items = [
    {
      title: 'Temporal Evidence',
      icon: Clock,
      passed: evidence.temporal?.passed ?? false,
      score: evidence.temporal?.score ?? 18,
      details: evidence.temporal?.zScores?.temperature
        ? `Z-score: +${Number(evidence.temporal.zScores.temperature).toFixed(2)} (High rate-of-change spike)`
        : 'Sudden rate of change exceeds physical thermal capacitance limits.'
    },
    {
      title: 'Spatial / Consensus',
      icon: MapPin,
      passed: evidence.spatial?.passed ?? false,
      score: evidence.spatial?.score ?? 15,
      details: evidence.spatial?.consensus?.temperature
        ? `Regional consensus: ${Number(evidence.spatial.consensus.temperature).toFixed(1)}°C (Isolated station outlier).`
        : 'Neighboring stations (AWS-017, AWS-009) observe standard 31–33°C conditions.'
    },
    {
      title: 'Multivariate Consistency',
      icon: Layers,
      passed: evidence.multivariate?.passed ?? false,
      score: evidence.multivariate?.score ?? 35,
      details: 'Physical thermodynamics: 55°C at 96% RH is discordant without a synoptic-scale tropical cyclone.'
    },
    {
      title: 'Physical QC Bounds',
      icon: Shield,
      passed: evidence.physical?.passed ?? true,
      score: evidence.physical?.score ?? 90,
      details: 'Reading is within broad planetary physical range (-40 to 60°C) but violates local meteorological envelope.'
    },
    {
      title: 'Historical Personality',
      icon: Calendar,
      passed: evidence.personality?.passed ?? false,
      score: evidence.personality?.score ?? 30,
      details: 'Deviates by +19.5°C from learned station historical diurnal baseline.'
    },
    {
      title: 'Sensor Digital Twin',
      icon: HeartPulse,
      passed: false,
      score: evidence.sensorHealth?.score ?? 61,
      details: 'Virtual health index degraded to 61/100; positive drift rate observed.'
    }
  ];

  return (
    <div className="sentinel-card p-5">
      <div className="pb-3 border-b border-sentinel-border flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Evidence Fusion Breakdown</h3>
        <span className="text-[10px] text-slate-500 font-medium">6 Multi-Modal QC Layers</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {items.map((it, idx) => {
          const Icon = it.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-md border flex items-start space-x-3 transition-colors ${
                it.passed
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : 'bg-red-50/40 border-red-200'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  it.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{it.title}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      it.passed ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
                    }`}
                  >
                    {it.passed ? 'SUPPORT' : 'ANOMALY'} ({it.score}/100)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">{it.details}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
