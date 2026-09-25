import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle2, Clock, AlertTriangle, Calendar, UserCheck } from 'lucide-react';
import { maintenanceService } from '../services/api';

export default function Maintenance() {
  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState({ required: 1, dueSoon: 2, scheduled: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTickets = () => {
    maintenanceService.getAll()
      .then(res => {
        if (res.data?.success) {
          setTickets(res.data.data);
          if (res.data.summary) setSummary(res.data.summary);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (id, status) => {
    await maintenanceService.update(id, { status });
    fetchTickets();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <Wrench className="w-5 h-5 text-purple-600" />
          <span>Predictive Maintenance & Field Engineering Dispatch</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Sensor degradation forecasts & preventive calibration scheduling prior to hard in-field failure
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="sentinel-card p-4 border-l-4 border-l-red-500">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Immediate Action Required</span>
          <p className="text-2xl font-black text-red-600 mt-1">{summary.required}</p>
        </div>
        <div className="sentinel-card p-4 border-l-4 border-l-amber-500">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Inspection Due Soon</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{summary.dueSoon}</p>
        </div>
        <div className="sentinel-card p-4 border-l-4 border-l-blue-500">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Field Team Dispatched</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{summary.scheduled}</p>
        </div>
        <div className="sentinel-card p-4 border-l-4 border-l-emerald-500">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Completed This Month</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{summary.completed}</p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.map((t) => (
          <div key={t._id} className="sentinel-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="font-extrabold text-blue-700 text-sm">{t.stationId}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  t.status === 'REQUIRED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {t.status}
                </span>
              </div>

              <div className="mt-3">
                <span className="text-xs font-bold text-slate-800 capitalize">
                  {t.sensorType} Sensor Recalibration
                </span>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  {t.recommendedAction}
                </p>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Current Sensor Health:</span>
                  <span className="font-bold text-slate-800">{t.currentHealth}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Failure Risk Level:</span>
                  <span className="font-bold text-red-600">{t.failureRisk}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Due Date:</span>
                  <span className="font-medium text-slate-700">
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'Within 7 Days'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Field Engineer:</span>
                  <span className="font-medium text-slate-700">{t.assignedTo}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold">{t.priority}</span>
              <button
                onClick={() => handleStatusChange(t._id, t.status === 'REQUIRED' ? 'SCHEDULED' : 'COMPLETED')}
                className="px-3 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                {t.status === 'REQUIRED' ? 'Dispatch Crew' : 'Mark Completed'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
