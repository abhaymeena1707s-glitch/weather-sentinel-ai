import React, { useState, useEffect } from 'react';
import { HeartPulse, Wrench, AlertTriangle, TrendingDown, CheckCircle2, ShieldCheck } from 'lucide-react';
import { healthService } from '../services/api';

export default function SensorHealth() {
  const [healthList, setHealthList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    healthService.getAll().then(res => {
      if (res.data?.success) {
        setHealthList(res.data.data);
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <HeartPulse className="w-5 h-5 text-blue-600" />
          <span>Sensor Digital Twin Virtual Health Profiles</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Predictive aging, drift tracking, and transducer degradation curves across meteorological instruments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {healthList.map((h) => {
          const isDegraded = h.healthScore < 70;
          return (
            <div
              key={h._id}
              className={`sentinel-card p-5 border-t-4 transition-all ${
                isDegraded ? 'border-t-amber-500' : 'border-t-emerald-500'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">{h.stationId}</span>
                  <h3 className="text-sm font-bold text-slate-900 capitalize">{h.sensorType} Sensor</h3>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-black ${isDegraded ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {h.healthScore}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold block">/ 100</span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Drift Rate:</span>
                  <span className="font-mono font-bold text-slate-800">{h.driftRate}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Sensor Noise Level:</span>
                  <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                    h.noiseLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {h.noiseLevel}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Recorded Spikes:</span>
                  <span className="font-semibold text-slate-800">{h.spikeCount}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Failure Risk:</span>
                  <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                    h.failureRisk === 'HIGH' ? 'bg-red-100 text-red-700' :
                    h.failureRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {h.failureRisk} RISK
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Degradation Trend:</span>
                  <span className="capitalize font-semibold text-slate-700">{h.degradationTrend}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Predictive Recommendation
                </span>
                <p className="text-xs text-slate-700 italic">
                  "{h.maintenanceRecommendation || 'Routine operation within normal tolerances.'}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
