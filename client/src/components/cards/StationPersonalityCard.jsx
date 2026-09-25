import React from 'react';
import { Sun, CloudSun, Moon, Activity, Zap } from 'lucide-react';

export default function StationPersonalityCard({ profile, stationId = 'AWS-042' }) {
  const p = profile || {
    morning: { tempMin: 24, tempMax: 29, humidityMin: 65, humidityMax: 85, pressureMin: 1002, pressureMax: 1008 },
    afternoon: { tempMin: 31, tempMax: 37, humidityMin: 45, humidityMax: 65, pressureMin: 998, pressureMax: 1005 },
    night: { tempMin: 22, tempMax: 26, humidityMin: 70, humidityMax: 90, pressureMin: 1004, pressureMax: 1009 },
    typicalNoise: '±0.25°C, ±0.4 hPa, ±1.5%',
    typicalRateOfChange: '< 1.8°C/hr',
    historicalAnomalyFrequency: '0.42% (Normal)'
  };

  return (
    <div className="sentinel-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-sentinel-border">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Station Personality</h3>
          <p className="text-[11px] text-slate-500">Locally learned diurnal climatological baseline ({stationId})</p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
          Adaptive Baseline
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        {/* Morning */}
        <div className="p-3 rounded-md bg-amber-50/40 border border-amber-200/60">
          <div className="flex items-center space-x-1.5 text-amber-700 mb-1">
            <Sun className="w-4 h-4" />
            <span className="text-xs font-bold">Morning Baseline</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Temperature:</span>
              <span className="font-semibold text-slate-800">{p.morning.tempMin} - {p.morning.tempMax}°C</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Humidity:</span>
              <span className="font-semibold text-slate-800">{p.morning.humidityMin} - {p.morning.humidityMax}%</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Pressure:</span>
              <span className="font-semibold text-slate-800">{p.morning.pressureMin} - {p.morning.pressureMax} hPa</span>
            </div>
          </div>
        </div>

        {/* Afternoon */}
        <div className="p-3 rounded-md bg-orange-50/40 border border-orange-200/60">
          <div className="flex items-center space-x-1.5 text-orange-700 mb-1">
            <CloudSun className="w-4 h-4" />
            <span className="text-xs font-bold">Afternoon Baseline</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Temperature:</span>
              <span className="font-semibold text-slate-800">{p.afternoon.tempMin} - {p.afternoon.tempMax}°C</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Humidity:</span>
              <span className="font-semibold text-slate-800">{p.afternoon.humidityMin} - {p.afternoon.humidityMax}%</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Pressure:</span>
              <span className="font-semibold text-slate-800">{p.afternoon.pressureMin} - {p.afternoon.pressureMax} hPa</span>
            </div>
          </div>
        </div>

        {/* Night */}
        <div className="p-3 rounded-md bg-indigo-50/40 border border-indigo-200/60">
          <div className="flex items-center space-x-1.5 text-indigo-700 mb-1">
            <Moon className="w-4 h-4" />
            <span className="text-xs font-bold">Night Baseline</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Temperature:</span>
              <span className="font-semibold text-slate-800">{p.night.tempMin} - {p.night.tempMax}°C</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Humidity:</span>
              <span className="font-semibold text-slate-800">{p.night.humidityMin} - {p.night.humidityMax}%</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Pressure:</span>
              <span className="font-semibold text-slate-800">{p.night.pressureMin} - {p.night.pressureMax} hPa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Volatility & Characteristics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider">Typical Noise</span>
          <span className="font-semibold text-slate-700">{p.typicalNoise}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider">Rate of Change Bound</span>
          <span className="font-semibold text-slate-700">{p.typicalRateOfChange}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider">Historical Anomaly Rate</span>
          <span className="font-semibold text-slate-700">{p.historicalAnomalyFrequency}</span>
        </div>
      </div>
    </div>
  );
}
