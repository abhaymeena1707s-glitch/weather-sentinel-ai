import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Search, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import SeverityBadge from '../components/alerts/SeverityBadge';
import { anomalyService } from '../services/api';

export default function Anomalies() {
  const navigate = useNavigate();
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    anomalyService.getAll()
      .then(res => {
        if (res.data?.success) {
          setAnomalies(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <Activity className="w-5 h-5 text-red-500" />
          <span>Anomaly Forensics & Multimodal Evidence Log</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Quality-control audit log classifying sensor defects vs genuine meteorological phenomena
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {anomalies.map((anom) => (
          <div
            key={anom._id}
            onClick={() => navigate(`/stations/${anom.stationId}`)}
            className="sentinel-card p-5 hover:border-blue-300 cursor-pointer transition-all border-l-4 border-l-red-500"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center space-x-3">
                <span className="font-extrabold text-sm text-blue-700">{anom.stationId}</span>
                <span className="text-xs font-bold text-slate-800">— {anom.rootCause || anom.type}</span>
                <SeverityBadge severity={anom.severity} />
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-slate-500">
                  {new Date(anom.createdAt).toLocaleString()}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  Confidence: {anom.confidence}%
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Observed Telemetry
                </span>
                <p className="font-mono text-slate-800 font-semibold">
                  T: {anom.observedValues?.temperature ?? '--'}°C | P: {anom.observedValues?.pressure ?? '--'} hPa | RH: {anom.observedValues?.humidity ?? '--'}%
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Counterfactual Normal Expected
                </span>
                <p className="font-mono text-emerald-700 font-semibold">
                  T: {anom.expectedValues?.temperature ?? '31.8'}°C | P: {anom.expectedValues?.pressure ?? '1003.2'} hPa | RH: {anom.expectedValues?.humidity ?? '64.5'}%
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  SHAP Feature Contributions
                </span>
                <div className="flex items-center space-x-2 font-mono text-[11px]">
                  <span className="text-red-600 font-bold">Temp: {anom.featureContributions?.temperature || 87}%</span>
                  <span>•</span>
                  <span className="text-blue-600">Press: {anom.featureContributions?.pressure || 21}%</span>
                  <span>•</span>
                  <span className="text-cyan-600">Hum: {anom.featureContributions?.humidity || 11}%</span>
                </div>
              </div>
            </div>

            {/* Reasons bullet points */}
            {anom.reasons && anom.reasons.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                {anom.reasons.map((r, idx) => (
                  <p key={idx} className="flex items-start space-x-1.5">
                    <span className="text-red-500 font-bold mt-0.5">•</span>
                    <span>{r}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
