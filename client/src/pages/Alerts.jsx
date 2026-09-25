import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Search, ShieldAlert, ArrowRight, Eye, ShieldCheck } from 'lucide-react';
import SeverityBadge from '../components/alerts/SeverityBadge';
import { alertService } from '../services/api';

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    alertService.getAll({ severity: filterSeverity, status: filterStatus })
      .then(res => {
        if (res.data?.success) {
          setAlerts(res.data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, [filterSeverity, filterStatus]);

  const handleAction = async (id, newStatus, e) => {
    e.stopPropagation();
    try {
      await alertService.update(id, { status: newStatus });
      fetchAlerts();
    } catch (err) {
      console.warn('Alert update error:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Meteorological & Sensor Alerts Console</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time quality-control triggers requiring operational investigation or maintenance triage
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs bg-white border border-sentinel-border rounded-md px-3 py-1.5"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-white border border-sentinel-border rounded-md px-3 py-1.5"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="sentinel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-sentinel-border text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Station ID</th>
                <th className="py-3 px-4">Root Cause Classification</th>
                <th className="py-3 px-4">Observed vs Expected</th>
                <th className="py-3 px-4 text-center">Confidence</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.map((al) => (
                <tr
                  key={al._id || al.id}
                  onClick={() => navigate(`/stations/${al.stationId}`)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <SeverityBadge severity={al.severity} />
                  </td>
                  <td className="py-3 px-4 font-bold text-blue-700">{al.stationId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    <div>{al.rootCause || al.type}</div>
                    <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs">{al.message}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="font-mono text-[11px] text-red-600 font-semibold">{al.observedValue}</div>
                    <div className="font-mono text-[10px] text-slate-400">Exp: {al.expectedValue}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-slate-700">{al.confidence || 90}%</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {al.timestamp ? new Date(al.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      al.status === 'ACTIVE' ? 'bg-red-100 text-red-700' :
                      al.status === 'ACKNOWLEDGED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {al.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                    {al.status === 'ACTIVE' && (
                      <button
                        onClick={(e) => handleAction(al._id, 'ACKNOWLEDGED', e)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/stations/${al.stationId}`);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                    >
                      Investigate
                    </button>
                    {al.status !== 'RESOLVED' && (
                      <button
                        onClick={(e) => handleAction(al._id, 'RESOLVED', e)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
