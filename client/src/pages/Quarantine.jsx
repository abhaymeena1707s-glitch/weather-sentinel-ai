import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Check, X, Undo, Sparkles, Filter } from 'lucide-react';
import { quarantineService } from '../services/api';

export default function Quarantine() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchRecords = () => {
    quarantineService.getAll({ status: statusFilter })
      .then(res => {
        if (res.data?.success) {
          setRecords(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, [statusFilter]);

  const handleAction = async (id, action) => {
    try {
      const res = await quarantineService.update(id, { action });
      if (res.data?.success) {
        setMessage(`Action "${action}" processed successfully.`);
        setTimeout(() => setMessage(''), 4000);
        fetchRecords();
      }
    } catch (err) {
      console.warn('Quarantine action error:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>Observation Quarantine & Human-in-the-Loop Validation</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preserved suspicious observations isolated from operational numerical weather models
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-white border border-sentinel-border rounded-md px-3 py-1.5 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Quarantine Statuses</option>
          <option value="QUARANTINED">Quarantined (Pending)</option>
          <option value="VERIFIED">Verified / Accepted</option>
          <option value="CORRECTED">Corrected Imputed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md font-medium">
          {message}
        </div>
      )}

      {/* Quarantine Table */}
      <div className="sentinel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-sentinel-border text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Station ID</th>
                <th className="py-3 px-4">Root Cause Classification</th>
                <th className="py-3 px-4">Observed Values</th>
                <th className="py-3 px-4">Counterfactual Expected</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Operator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((rec) => {
                const obs = rec.observedValue || {};
                const exp = rec.expectedValue || {};

                return (
                  <tr key={rec._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-blue-700">{rec.stationId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div>{rec.rootCause}</div>
                      <div className="text-[10px] text-slate-400 font-normal italic">
                        {rec.operatorNotes || 'Auto-quarantined by Evidence Fusion Engine'}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-red-600 font-bold">
                      {obs.temperature !== undefined ? `${obs.temperature}°C` : '--'} / {obs.pressure} hPa / {obs.humidity}%
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-emerald-700 font-bold">
                      {exp.temperature !== undefined ? `${exp.temperature}°C` : '--'} / {exp.pressure} hPa / {exp.humidity}%
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {rec.anomalyScore}%
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(rec.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.status === 'QUARANTINED' ? 'bg-amber-100 text-amber-800' :
                        rec.status === 'CORRECTED' ? 'bg-blue-100 text-blue-800' :
                        rec.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      {rec.status === 'QUARANTINED' ? (
                        <>
                          <button
                            onClick={() => handleAction(rec._id, 'APPLY_CORRECTION')}
                            className="px-2 py-1 text-[11px] font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                            title="Impute Counterfactual Estimate"
                          >
                            Apply Correction
                          </button>
                          <button
                            onClick={() => handleAction(rec._id, 'ACCEPT_RAW')}
                            className="px-2 py-1 text-[11px] font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            title="Accept as Genuine Event"
                          >
                            Accept Raw
                          </button>
                          <button
                            onClick={() => handleAction(rec._id, 'REJECT')}
                            className="px-2 py-1 text-[11px] font-semibold rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                            title="Permanently Flag as Fault"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleAction(rec._id, 'RESTORE')}
                          className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border"
                        >
                          Re-quarantine
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
