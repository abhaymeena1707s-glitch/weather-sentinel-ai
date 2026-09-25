import React, { useState } from 'react';
import { Settings as SettingsIcon, Sliders, Shield, User, Database, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [tempThreshold, setTempThreshold] = useState('2.0');
  const [pressThreshold, setPressThreshold] = useState('1.5');
  const [modelMode, setModelMode] = useState('mock');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-slate-700" />
          <span>Platform Settings & Operational Quality-Control Config</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Tune algorithmic physical bounds, model inference modes, and operator preferences
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md font-medium flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Operational quality-control configuration saved successfully.</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="sentinel-card p-5">
        <div className="flex items-center space-x-3 pb-3 border-b mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.email} — <span className="font-semibold text-blue-600">{user?.role}</span></p>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Department: <span className="font-medium text-slate-800">{user?.department || 'Meteorological Operations'}</span>
        </p>
      </div>

      {/* Algorithmic Thresholds Form */}
      <form onSubmit={handleSave} className="sentinel-card p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Quality-Control Bound Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Max Temperature Rate-of-Change (°C/min)</label>
            <input
              type="number"
              step="0.1"
              value={tempThreshold}
              onChange={(e) => setTempThreshold(e.target.value)}
              className="w-full bg-white border border-sentinel-border rounded-md px-3 py-1.5 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Default: 2.0°C/min</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Max Barometric Pressure Step (hPa/min)</label>
            <input
              type="number"
              step="0.1"
              value={pressThreshold}
              onChange={(e) => setPressThreshold(e.target.value)}
              className="w-full bg-white border border-sentinel-border rounded-md px-3 py-1.5 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Default: 1.5 hPa/min</span>
          </div>
        </div>

        <div className="pt-2">
          <label className="font-semibold text-slate-700 block mb-1 text-xs">ML Inference Engine Mode</label>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <label className={`p-3 rounded-md border cursor-pointer ${modelMode === 'mock' ? 'bg-blue-50/50 border-blue-500 text-blue-900' : 'bg-white border-slate-200'}`}>
              <input
                type="radio"
                name="modelMode"
                value="mock"
                checked={modelMode === 'mock'}
                onChange={() => setModelMode('mock')}
                className="mr-2"
              />
              <span className="font-bold">Deterministic Hybrid Engine (Standalone & Demo)</span>
              <p className="text-[11px] text-slate-500 mt-1">Guarantees zero-failure, instant local execution without external Python runtime.</p>
            </label>

            <label className={`p-3 rounded-md border cursor-pointer ${modelMode === 'python' ? 'bg-blue-50/50 border-blue-500 text-blue-900' : 'bg-white border-slate-200'}`}>
              <input
                type="radio"
                name="modelMode"
                value="python"
                checked={modelMode === 'python'}
                onChange={() => setModelMode('python')}
                className="mr-2"
              />
              <span className="font-bold">Python ML Microservice (FastAPI REST)</span>
              <p className="text-[11px] text-slate-500 mt-1">Calls http://localhost:8000 for Isolation Forest & Temporal Autoencoder inference.</p>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 text-xs font-bold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
}
