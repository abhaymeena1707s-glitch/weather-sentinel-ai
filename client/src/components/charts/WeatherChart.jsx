import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export default function WeatherChart({ readings = [], height = 300, stationId = 'AWS-042' }) {
  const [selectedParam, setSelectedParam] = useState('temperature');

  const configs = {
    temperature: { name: 'Temperature', unit: '°C', color: '#DC2626', key: 'temperature', expectedKey: 'expectedTemperature' },
    pressure: { name: 'Pressure', unit: 'hPa', color: '#2563EB', key: 'pressure', expectedKey: 'expectedPressure' },
    humidity: { name: 'Humidity', unit: '%', color: '#0891B2', key: 'humidity', expectedKey: 'expectedHumidity' }
  };

  const currentCfg = configs[selectedParam];

  // Format data for Recharts
  const chartData = readings.map((r, idx) => {
    const timeStr = r.timestamp ? new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `T-${idx}`;
    return {
      time: timeStr,
      value: r[currentCfg.key],
      expected: r[currentCfg.expectedKey] || (selectedParam === 'temperature' ? 31.8 : selectedParam === 'pressure' ? 1003.2 : 64.5),
      isQuarantined: r.isQuarantined || r.anomalyScore > 60
    };
  });

  return (
    <div className="sentinel-card p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-sentinel-border gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Live Meteorological Telemetry</h3>
          <p className="text-[11px] text-slate-500">Continuous 10-minute reporting interval ({stationId})</p>
        </div>

        {/* Parameter Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-md text-xs font-semibold">
          <button
            onClick={() => setSelectedParam('temperature')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedParam === 'temperature' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Temperature (°C)
          </button>
          <button
            onClick={() => setSelectedParam('pressure')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedParam === 'pressure' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pressure (hPa)
          </button>
          <button
            onClick={() => setSelectedParam('humidity')}
            className={`px-2.5 py-1 rounded transition-colors ${
              selectedParam === 'humidity' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Humidity (%)
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-4" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748B' }} stroke="#CBD5E1" />
            <YAxis tick={{ fontSize: 10, fill: '#64748B' }} stroke="#CBD5E1" domain={['auto', 'auto']} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-navy-900 text-white text-xs p-2.5 rounded shadow-lg border border-navy-700">
                      <p className="font-bold text-slate-300">{label}</p>
                      <p className="mt-1 text-red-300">
                        Observed: <span className="font-bold text-white">{payload[0]?.value} {currentCfg.unit}</span>
                      </p>
                      {payload[1] && (
                        <p className="text-emerald-300">
                          Expected: <span className="font-bold text-white">{payload[1]?.value} {currentCfg.unit}</span>
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Expected Normal Baseline Line */}
            <Line
              type="monotone"
              dataKey="expected"
              stroke="#10B981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              dot={false}
              name="Expected Normal"
            />
            {/* Actual Observed Telemetry Line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke={currentCfg.color}
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
              name="Observed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-1 bg-red-600 rounded"></span>
            <span>Observed Sensor Reading</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-1 bg-emerald-500 rounded border border-dashed border-emerald-500"></span>
            <span>Counterfactual Expected Normal</span>
          </div>
        </div>
        <span className="italic">AI Quality Control & Temporal Consistency Active</span>
      </div>
    </div>
  );
}
