import React, { useState } from 'react';
import { FileBarChart2, Download, Calendar, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export default function Reports() {
  const [downloading, setDownloading] = useState(false);

  const triggerExport = (format) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Weather Sentinel AI Quality Control Report exported in ${format.toUpperCase()} format.`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <FileBarChart2 className="w-5 h-5 text-blue-600" />
            <span>Meteorological QC & Compliance Reports</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational quality assurance summaries aligned with WMO-No. 8 standards
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => triggerExport('pdf')}
            disabled={downloading}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Official PDF</span>
          </button>
          <button
            onClick={() => triggerExport('csv')}
            disabled={downloading}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="sentinel-card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Weekly Network Data Quality Report</h3>
          <p className="text-xs text-slate-500 mb-4">Comprehensive evaluation of 25 Karnataka AWS stations</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-600">Reporting Interval:</span>
              <span className="font-semibold text-slate-800">Past 7 Days</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-600">Total Observations Ingested:</span>
              <span className="font-semibold text-slate-800">25,200</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-600">Overall Trust Score:</span>
              <span className="font-bold text-emerald-600">89.4 / 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Quarantine Isolation Rate:</span>
              <span className="font-semibold text-slate-800">0.82%</span>
            </div>
          </div>
        </div>

        <div className="sentinel-card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Sensor Calibration & Drift Audit</h3>
          <p className="text-xs text-slate-500 mb-4">Instrument digital twins and recalibration tracking</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-600">Healthy Sensor Transducers:</span>
              <span className="font-semibold text-emerald-600">71 / 75 (94.6%)</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-600">Degraded Sensors Flagged:</span>
              <span className="font-semibold text-amber-600">3 Units</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-600">Immediate Recalibration:</span>
              <span className="font-bold text-red-600">1 Unit (AWS-042 Temp)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Audited By:</span>
              <span className="font-semibold text-slate-800">AI Predictive Maintenance Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
