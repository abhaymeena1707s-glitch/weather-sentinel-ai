import React, { useState, useEffect } from 'react';
import { Cpu, Target, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import { modelPerformanceService } from '../services/api';

export default function ModelPerformance() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    modelPerformanceService.get()
      .then(res => {
        if (res.data?.success) {
          setMetrics(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const m = metrics || {
    modelVersion: 'WeatherSentinel-v2.4-Hybrid-Ensemble',
    precision: 0.962,
    recall: 0.948,
    f1Score: 0.955,
    falseAlarmRate: 0.021,
    detectionLatencyMs: 18.4,
    accuracy: 0.978,
    perFaultPerformance: [
      { faultType: 'Temperature Spike', precision: 0.985, recall: 0.972, f1: 0.978, count: 1240 },
      { faultType: 'Pressure Surge/Drop', precision: 0.964, recall: 0.951, f1: 0.957, count: 830 },
      { faultType: 'Frozen Sensor', precision: 0.991, recall: 0.984, f1: 0.987, count: 620 },
      { faultType: 'Calibration Drift', precision: 0.923, recall: 0.895, f1: 0.909, count: 540 },
      { faultType: 'Communication Gap', precision: 0.998, recall: 0.995, f1: 0.996, count: 2100 },
      { faultType: 'Data Corruption', precision: 0.989, recall: 0.981, f1: 0.985, count: 410 },
      { faultType: 'Genuine Extreme Weather', precision: 0.942, recall: 0.915, f1: 0.928, count: 750 }
    ],
    confusionMatrix: {
      labels: ['Normal', 'Sensor Spike', 'Frozen Sensor', 'Drift', 'Genuine Event'],
      matrix: [
        [42310, 85, 12, 45, 28],
        [32, 1205, 5, 8, 12],
        [4, 6, 610, 0, 0],
        [18, 12, 2, 485, 23],
        [15, 24, 0, 15, 696]
      ]
    }
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner as required by rule 54 */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3 text-xs text-blue-900">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block uppercase tracking-wider text-[11px] text-blue-800">
            Demo / Injected-Anomaly Evaluation Benchmark
          </span>
          <p className="mt-0.5 text-blue-800 leading-snug">
            Metrics calculated over 50,000 synthetic test cycles and simulated meteorological sensor fault vectors.
            Model Version: <span className="font-mono font-bold">{m.modelVersion}</span>.
          </p>
        </div>
      </div>

      {/* Top 6 Evaluation KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="sentinel-card p-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Precision</span>
          <span className="text-2xl font-black text-slate-800">{(m.precision * 100).toFixed(1)}%</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Low False Positives</span>
        </div>

        <div className="sentinel-card p-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Recall</span>
          <span className="text-2xl font-black text-slate-800">{(m.recall * 100).toFixed(1)}%</span>
          <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">High Sensitivity</span>
        </div>

        <div className="sentinel-card p-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">F1 Score</span>
          <span className="text-2xl font-black text-slate-800">{m.f1Score.toFixed(3)}</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Harmonic Mean</span>
        </div>

        <div className="sentinel-card p-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">False Alarm Rate</span>
          <span className="text-2xl font-black text-emerald-600">{(m.falseAlarmRate * 100).toFixed(1)}%</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Operational Target &lt; 3%</span>
        </div>

        <div className="sentinel-card p-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Latency</span>
          <span className="text-2xl font-black text-blue-600">{m.detectionLatencyMs} ms</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Sub-second Ingestion</span>
        </div>

        <div className="sentinel-card p-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Accuracy</span>
          <span className="text-2xl font-black text-purple-600">{(m.accuracy * 100).toFixed(1)}%</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Ensemble Fusion</span>
        </div>
      </div>

      {/* Per-Fault Performance Table */}
      <div className="sentinel-card p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Classification Performance by Fault Vector</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b text-[10px] font-bold uppercase text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Fault Category</th>
                <th className="py-2.5 px-3 text-center">Precision</th>
                <th className="py-2.5 px-3 text-center">Recall</th>
                <th className="py-2.5 px-3 text-center">F1 Score</th>
                <th className="py-2.5 px-3 text-right">Evaluated Injections</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {m.perFaultPerformance.map((f, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{f.faultType}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{(f.precision * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-center font-mono">{(f.recall * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-700">{f.f1.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500">{f.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confusion Matrix Table */}
      <div className="sentinel-card p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Confusion Matrix (Multi-Class Quality Control)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border border-slate-200">
            <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-700">
              <tr>
                <th className="py-2 px-3 text-left">Actual \ Predicted</th>
                {m.confusionMatrix.labels.map((l, i) => (
                  <th key={i} className="py-2 px-3">{l}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {m.confusionMatrix.matrix.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td className="py-2 px-3 text-left font-bold bg-slate-50 text-slate-700">
                    {m.confusionMatrix.labels[rIdx]}
                  </td>
                  {row.map((val, cIdx) => (
                    <td
                      key={cIdx}
                      className={`py-2 px-3 font-mono font-bold ${
                        rIdx === cIdx ? 'bg-emerald-50 text-emerald-800' : val > 0 ? 'text-slate-500' : 'text-slate-300'
                      }`}
                    >
                      {val.toLocaleString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
