import React from 'react';
import { Thermometer, Gauge, Droplets, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function WeatherMetricCard({
  parameter = 'temperature',
  value,
  expected,
  isAnomaly = false,
  unit = '°C',
  stationId = 'AWS-042'
}) {
  const configs = {
    temperature: {
      name: 'Temperature',
      icon: Thermometer,
      unit: '°C',
      normalRange: '22 - 35°C',
      accentColor: isAnomaly ? 'text-red-600' : 'text-amber-600',
      bgGlow: isAnomaly ? 'border-red-300 bg-red-50/30' : 'border-sentinel-border bg-white'
    },
    pressure: {
      name: 'Atmospheric Pressure',
      icon: Gauge,
      unit: 'hPa',
      normalRange: '1000 - 1008 hPa',
      accentColor: isAnomaly ? 'text-red-600' : 'text-blue-600',
      bgGlow: isAnomaly ? 'border-red-300 bg-red-50/30' : 'border-sentinel-border bg-white'
    },
    humidity: {
      name: 'Relative Humidity',
      icon: Droplets,
      unit: '%',
      normalRange: '45 - 85%',
      accentColor: isAnomaly ? 'text-red-600' : 'text-cyan-600',
      bgGlow: isAnomaly ? 'border-red-300 bg-red-50/30' : 'border-sentinel-border bg-white'
    }
  };

  const cfg = configs[parameter] || configs.temperature;
  const Icon = cfg.icon;

  return (
    <div className={`sentinel-card p-4 border transition-all ${cfg.bgGlow}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${cfg.accentColor}`} />
          <span className="text-xs font-semibold text-slate-700">{cfg.name}</span>
        </div>
        <span
          className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
            isAnomaly
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {isAnomaly ? 'Anomaly' : 'Normal'}
        </span>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="flex items-baseline space-x-1">
          <span className={`text-3xl font-extrabold tracking-tight ${isAnomaly ? 'text-red-600' : 'text-slate-900'}`}>
            {value !== undefined && value !== null ? Number(value).toFixed(1) : '--'}
          </span>
          <span className="text-sm font-semibold text-slate-500">{cfg.unit}</span>
        </div>
        {expected !== undefined && expected !== null && isAnomaly && (
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Expected Normal</span>
            <span className="text-xs font-bold text-slate-700">{Number(expected).toFixed(1)} {cfg.unit}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Diurnal Normal: {cfg.normalRange}</span>
        {isAnomaly && (
          <span className="text-red-600 font-semibold flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>Outlier</span>
          </span>
        )}
      </div>
    </div>
  );
}
